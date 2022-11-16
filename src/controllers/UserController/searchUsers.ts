import { Request, Response } from 'express'
import { UserModel } from '../../models/UserModel'

/**
 * @description     Get or Search all users
 * @route           GET /api/users/search?q=
 * @access          Private
 */

export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  const keyword = req.query.q
    ? {
        $or: [
          { name: { $regex: req.query.q, $options: 'i' } },
          { email: { $regex: req.query.q, $options: 'i' } }
        ]
      }
    : {}

  if (!req.user) {
    res
      .status(422)
      .json({ errors: ['Houve um erro, por favor tente mais tarde.'] })
    return
  }

  const users = await UserModel.find(keyword)
    .find({
      _id: { $ne: req.user._id }
    })
    .select('-password')

  res.status(200).json(users)
}
