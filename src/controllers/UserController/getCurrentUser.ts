import { Request, Response } from 'express'
import 'dotenv/config'

import { UserModel } from '../../models/UserModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

/**
  @description     Get current user profile
  @route           GET /api/users/
  @access          Private
 */
export const getCurrentUser = tryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const user =
      req.user && (await UserModel.findById(req.user._id).select('-password'))

    // Check if user exists
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado')
    }

    // Return user profile
    res.status(200).json(user)
  }
)
