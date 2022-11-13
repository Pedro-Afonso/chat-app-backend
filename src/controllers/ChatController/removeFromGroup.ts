import { Request, Response } from 'express'
import { ChatModel } from '../../models/ChatModel'

/**
  @description     Remove user from group chat
  @route           DELETE /api/chats/group/:groupId/users/:userId
  @access          Private
 */
export const removeFromGroup = async (req: Request, res: Response) => {
  const { groupId, userId } = req.params

  if (!groupId || !groupId || !req.user) {
    res
      .status(422)
      .json({ errors: 'Houve um erro, por favor tente mais tarde.' })
    return
  }

  const populateOptions = [
    { path: 'users', select: '-password' },
    { path: 'groupAdmin', select: '-password' }
  ]

  const groupChat = await ChatModel.findById(groupId).populate(populateOptions)

  // Check if group chat exists
  if (!groupChat) {
    res.status(404).json({ errors: ['Chat não encontrado'] })
    return
  }

  // Check if group chat belongs to user
  if (!req.user || !groupChat.groupAdmin.equals(req.user._id)) {
    res.status(422).json({ errors: ['Usuário não autorizado!'] })
    return
  }

  // Remove user from group chat
  await groupChat.updateOne({ $pull: { users: userId } })

  res
    .status(200)
    .json({ chat: groupChat, message: 'Usuário removido com sucesso!' })
}
