import { Request, Response } from 'express'

import { ChatModel } from '../../models/ChatModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Access or create a new chat
  @route           POST /api/chats/
  @access          Private
 */
export const accessChat = tryCatch(async (req: Request, res: Response) => {
  const { userId } = req.body

  if (!userId || !req.user) {
    throw new AppError(400)
  }

  const filterOptions = {
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } }
    ]
  }

  const populateOptions = [
    { path: 'users', select: '-password' },
    {
      path: 'latestMessage',
      populate: { path: 'sender', select: 'name profileImage email' }
    }
  ]

  const chat = await ChatModel.find(filterOptions).populate(populateOptions)
  if (chat.length > 0) {
    res.status(200).json({ chat: chat[0], message: '' })
    return
  }

  const chatData = {
    name: 'sender',
    isGroupChat: false,
    users: [req.user._id, userId]
  }

  const createdChat = await ChatModel.create(chatData)

  await createdChat.populate('users', '-password')

  res.status(201).json({ chat: createdChat, message: 'Inicie uma conversa.' })
})
