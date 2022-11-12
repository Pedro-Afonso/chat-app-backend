import { Request, Response } from 'express'

import { hashPassword, generateToken } from '../../utils'
import { UserModel } from '../../models/UserModel'

/**
  @description     Register a user
  @route           POST /api/users/register
  @access          Public
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body

  // Check if user exists
  const user = await UserModel.findOne({ email })

  const jwtSecret = process.env.JWT_SECRET

  if (user) {
    res
      .status(422)
      .json({ errors: 'Já existe um usuário cadastrado com esse e-mail.' })
    return
  }

  // Generate password hash
  const passwordHash = await hashPassword(password)

  // Create user
  const newUser = await UserModel.create({
    name,
    email,
    password: passwordHash
  })

  // Check if user was created sucessfully
  if (!newUser || !jwtSecret) {
    res.status(422).json({
      errors: ['Houve um erro, por favor tente mais tarde.']
    })
    return
  }

  // Return the token
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id, jwtSecret)
  })
}
