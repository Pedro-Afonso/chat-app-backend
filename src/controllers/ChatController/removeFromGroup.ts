import { Request, Response } from 'express'

import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Remove user from group chat
  @route           DELETE /api/chats/group/:groupId/users/:userId
  @access          Private
 */
export const removeFromGroup = tryCatch(async (req: Request, res: Response) => {
  const { groupId, userId } = req.params

  if (!groupId || !groupId || !req.user) {
    throw new AppError(400)
  }

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  // Remove user from group chat
  const groupChat = await ChatModel.findByIdAndUpdate(
    groupId,
    { $pull: { users: userId } },
    { new: true }
  ).populate(populateOptions)

  // Check if group chat exists
  if (!groupChat) {
    throw new AppError(404)
  }

  res
    .status(200)
    .json({ chat: groupChat, message: 'Usuário removido com sucesso!' })
})
