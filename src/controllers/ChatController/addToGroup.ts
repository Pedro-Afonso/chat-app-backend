import { Request, Response } from 'express'

import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Add user to group chat
  @route           PUT /api/chats/group/:groupId/users/:userId
  @access          Private
 */
export const addToGroup = tryCatch(async (req: Request, res: Response) => {
  const { groupId, userId } = req.params

  if (!groupId || !groupId || !req.user) {
    throw new AppError(400)
  }

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  // Add user to group chat
  const groupChat = await ChatModel.findByIdAndUpdate(
    groupId,
    { $addToSet: { users: userId } },
    { new: true }
  ).populate(populateOptions)

  // Check if group chat exists
  if (!groupChat) {
    throw new AppError(400, 'Chat não encontrado')
  }

  res
    .status(200)
    .json({ chat: groupChat, message: 'Usuário adicionado com sucesso!' })
})
