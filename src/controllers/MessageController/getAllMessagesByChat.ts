import { Request, Response } from 'express'
import { MessageModel } from '../../models/MessageModel'

/**
  @description     Fetch all messages by chat
  @route           GET /api/messages/chat/:chatId
  @access          Private
 */
export const getAllMessagesByChat = async (req: Request, res: Response) => {
  const { chatId } = req.params

  if (!chatId || !req.user) {
    res
      .status(422)
      .json({ errors: 'Houve um erro, por favor tente mais tarde.' })
    return
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
    res
      .status(404)
      .json({ errors: ['Houve um erro, por favor tente mais tarde.'] })
    return
  }

  res.status(200).json({
    chatMessages: messages,
    message: 'Mensagens carregadas com sucesso!'
  })
}
