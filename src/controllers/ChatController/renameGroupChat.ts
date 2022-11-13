import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'

/**
  @description     Rename chat
  @route           PUT /api/chats/group/:id
  @access          Private
 */
export const renameGroupChat = async (req: Request, res: Response) => {
  const { id: chatId } = req.params

  const { newChatName } = req.body

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  const groupChat = await ChatModel.findById(chatId).populate(populateOptions)

  // Check if group chat exists
  if (!groupChat) {
    res.status(404).json({ errors: ['Chat não encontrado'] })
    return
  }

  // Check if group chat belongs to user
  if (!req.user || !groupChat.groupAdmin.equals(req.user._id)) {
    res
      .status(422)
      .json({ errors: ['Ocorreu um erro, tente novamente mais tarde'] })
    return
  }

  groupChat.name = newChatName

  await groupChat.save()

  res.status(200).json(groupChat)
}
