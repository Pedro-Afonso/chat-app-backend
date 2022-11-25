import { Request, Response } from 'express'

import { MessageModel } from '../../models/MessageModel'
import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Create new message
  @route           POST /api/messages/
  @access          Private
 */
export const sendMessage = tryCatch(async (req: Request, res: Response) => {
  const { content, chatId } = req.body

  if (!content || !req.user) {
    throw new AppError(400)
  }

  const messageData = {
    sender: req.user._id,
    content,
    chat: chatId
  }

  const newMessage = await MessageModel.create(messageData)

  // Check if message was created succesfully
  if (!newMessage) {
    throw new AppError(400)
  }

  const populateOptions = [
    { path: 'sender', select: 'name profileImage' },
    { path: 'chat' },
    {
      path: 'chat',
      populate: { path: 'users', select: 'name profileImage email' }
    }
  ]

  // Remove user from group chat
  await newMessage.populate(populateOptions)

  // Update latest message
  await ChatModel.findByIdAndUpdate(chatId, {
    latestMessage: newMessage._id
  })

  res.status(200).json({
    chatMessage: newMessage,
    message: 'Mensagem adicionada com sucesso!'
  })
})
