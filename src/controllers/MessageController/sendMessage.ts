import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'
import { MessageModel } from '../../models/MessageModel'

/**
  @description     Create new message
  @route           POST /api/messages/
  @access          Private
 */
export const sendMessage = async (req: Request, res: Response) => {
  const { content, chatId } = req.body

  if (!content || !req.user) {
    res
      .status(422)
      .json({ errors: 'Houve um erro, por favor tente mais tarde.' })
    return
  }

  const messageData = {
    sender: req.user._id,
    content,
    chat: chatId
  }

  const newMessage = await MessageModel.create(messageData)

  // Check if message was created succesfully
  if (!newMessage) {
    res
      .status(404)
      .json({ errors: ['Houve um erro, por favor tente mais tarde.'] })
    return
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
}
