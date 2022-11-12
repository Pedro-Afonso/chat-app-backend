import { compare } from 'bcryptjs'
import { Request, Response } from 'express'
import 'dotenv/config'

import { generateToken } from '../../utils'
import { UserModel } from '../../models/UserModel'

/**
  @description     Sign user in
  @route           GET /api/users/login
  @access          Public
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  const user = await UserModel.findOne({ email })

  // Check if user exists
  if (!user) {
    res.status(404).json({ errors: ['Usuário não encontrado'] })
    return
  }

  // Check if passwords matches
  if (!(await compare(password, user.password))) {
    res.status(422).json({ errors: ['Senha inválida'] })
    return
  }

  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret) {
    res
      .status(422)
      .json({ errors: ['Houve um erro, por favor tente mais tarde.'] })
    return
  }

  // Return user with token
  res.status(200).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id, jwtSecret)
  })
}
