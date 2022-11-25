import { Request, Response } from 'express'

import { UserModel } from '../../models/UserModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'
/**
 * @description     Get or Search all users
 * @route           GET /api/users/search?q=
 * @access          Private
 */

export const searchUsers = tryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } }
          ]
        }
      : {}

    if (!req.user) {
      throw new AppError(422, 'Houve um erro, por favor tente mais tarde.')
    }

    const users = await UserModel.find(keyword)
      .find({
        _id: { $ne: req.user._id }
      })
      .select('-password')

    res.status(200).json(users)
  }
)
