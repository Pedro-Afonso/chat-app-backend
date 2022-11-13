import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'

/**
  @description     Create a new group chat
  @route           POST /api/chats/group/
  @access          Private
 */
export const createGroupChat = async (req: Request, res: Response) => {
  const users = JSON.parse(req.body.users)

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

  res.status(200).json(groupChat)
}
