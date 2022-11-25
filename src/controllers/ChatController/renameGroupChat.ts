import { Request, Response } from 'express'

import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Rename chat
  @route           PUT /api/chats/group/:id
  @access          Private
 */
export const renameGroupChat = tryCatch(async (req: Request, res: Response) => {
  const { id: chatId } = req.params

  const { newChatName } = req.body

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  const groupChat = await ChatModel.findById(chatId).populate(populateOptions)

  // Check if group chat exists
  if (!groupChat) {
    throw new AppError(404)
  }

  // Check if group chat belongs to user
  if (!req.user || !groupChat.groupAdmin.equals(req.user._id)) {
    throw new AppError(400)
  }

  groupChat.name = newChatName

  await groupChat.save()

  res
    .status(200)
    .json({ chat: groupChat, message: 'Nome do grupo alterado com sucesso!' })
})
