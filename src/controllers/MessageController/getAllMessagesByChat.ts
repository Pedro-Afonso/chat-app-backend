import { Request, Response } from 'express'

import { MessageModel } from '../../models/MessageModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Fetch all messages by chat
  @route           GET /api/messages/chat/:chatId
  @access          Private
 */
export const getAllMessagesByChat = tryCatch(
  async (req: Request, res: Response) => {
    const { chatId } = req.params

    if (!chatId || !req.user) {
      throw new AppError(422)
    }

    const filterOptions = { chat: { $in: chatId } }

    const populateOptions = [
      { path: 'chat' },
      { path: 'sender', select: 'name profileImage email' }
    ]

    const messages = await MessageModel.find(filterOptions)
      .limit(50)
      .populate(populateOptions)
      .sort({ updatedAt: 'desc' })

    // Check if message was created succesfully
    if (!messages) {
      throw new AppError(422)
    }

    res.status(200).json({
      chatMessages: messages,
      message: 'Mensagens carregadas com sucesso!'
    })
  }
)
