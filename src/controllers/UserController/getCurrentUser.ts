import { Request, Response } from 'express'
import 'dotenv/config'

import { UserModel } from '../../models/UserModel'

/**
  @description     Get current user profile
  @route           GET /api/users/
  @access          Private
 */
export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user =
    req.user && (await UserModel.findById(req.user._id).select('-password'))

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ['Usuário não encontrado'] })
    return
  }

  // Return user profile
  res.status(200).json(user)
}
