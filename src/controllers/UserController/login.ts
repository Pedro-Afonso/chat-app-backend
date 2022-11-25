import { compare } from 'bcryptjs'
import { Request, Response } from 'express'
import 'dotenv/config'

import { UserModel } from '../../models/UserModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'
import { generateToken } from '../../utils'
/**
  @description     Sign user in
  @route           POST /api/users/login
  @access          Public
 */
export const login = tryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    const user = await UserModel.findOne({ email })

    // Check if user exists
    if (!user) {
      throw new AppError(404, 'Usuário não encontrado')
    }

    // Check if passwords matches
    if (!(await compare(password, user.password))) {
      throw new AppError(422, 'Senha inválida')
    }

    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
      throw new AppError(422)
    }

    // Return user with token
    res.status(200).json({
      _id: user._id,
      profileImage: user.profileImage,
      token: generateToken(user._id, jwtSecret)
    })
  }
)
