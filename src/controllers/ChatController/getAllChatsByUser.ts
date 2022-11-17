import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'

/**
  @description     Fetch all chats for a user
  @route           GET /api/chats/
  @access          Private
 */
export const getAllChatsByUser = async (req: Request, res: Response) => {
  if (!req.user) {
    res
      .status(422)
      .json({ errors: 'Houve um erro, por favor tente mais tarde.' })
    return
  }

  const filterOptions = { users: { $in: req.user._id } }

  const populateOptions1 = [
    {
      path: 'latestMessage',
      populate: { path: 'sender', select: '-password' }
    },
    { path: 'groupAdmin', select: '-password' }
  ]

  const populateOptions2 = [
    {
      path: 'latestMessage',
      populate: { path: 'sender', select: '-password' }
    },
    { path: 'users', select: '-password' }
  ]

  const chat = await ChatModel.find(filterOptions)
    .limit(100)
    .sort({ updatedAt: 'desc' })
    .then(async docs => {
      for (const doc of docs) {
        if (doc.isGroupChat) {
          await doc.populate(populateOptions1)
        } else {
          if (req.user && doc.users[0] === req.user._id) {
            doc.users.pop()
          } else {
            doc.users.shift()
          }
          await doc.populate(populateOptions2)
        }
      }
      return docs
    })

  res.status(200).json(chat)
}
