import { Request, Response } from 'express'

import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Fetch all chats for a user
  @route           GET /api/chats/
  @access          Private
 */
export const getAllChatsByUser = tryCatch(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(400)
    }

    const filterOptions = { users: { $in: req.user._id } }

    const populateOptions = [
      {
        path: 'latestMessage',
        populate: { path: 'sender', select: '-password' }
      },
      { path: 'groupAdmin', select: '-password' },
      { path: 'users', select: '-password' }
    ]

    const chat = await ChatModel.find(filterOptions)
      .limit(100)
      .sort({ updatedAt: 'desc' })
      .populate(populateOptions)

    res.status(200).json(chat)
  }
)
