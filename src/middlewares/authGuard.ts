import { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line import/default
import { verify, JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

import { UserModel } from '../models/UserModel'

const jwtSecret = process.env.JWT_SECRET

const authGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  // Check if header has a token
  if (!token || !jwtSecret) {
    return res.status(401).json({ errors: ['Acesso negado!'] })
  }

  // Check if token is valid
  try {
    const verified = verify(token, jwtSecret) as JwtPayload

    const user = await UserModel.findById(verified.id).select('-password')

    if (!user) {
      return res.status(400).json({ errors: ['Usuário não existe'] })
    }

    req.user = user

    next()
  } catch (error) {
    res.status(400).json({ errors: ['O Token é inválido!'] })
  }
}

export { authGuard }
