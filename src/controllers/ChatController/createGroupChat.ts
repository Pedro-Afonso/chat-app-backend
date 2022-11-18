import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'

/**
  @description     Create a new group chat
  @route           POST /api/chats/group/
  @access          Private
 */
export const createGroupChat = async (req: Request, res: Response) => {
  const users = req.body.users

  if (users.length < 2) {
    res.status(400).json({
      errors: ['Para criar um grupo você precisa de pelo menos 2 pessoas!']
    })
  }

  users.push(req.user)

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  const groupChatData = {
    name: req.body.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user
  }

  const groupChat = await ChatModel.create(groupChatData)

  await groupChat.populate(populateOptions)

  res
    .status(201)
    .json({ chat: groupChat, message: 'Grupo criado com sucesso!' })
}
