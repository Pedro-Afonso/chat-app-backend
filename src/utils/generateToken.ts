import { sign } from 'jsonwebtoken'
import { Types } from 'mongoose'
import 'dotenv/config'

// Generate user token
export const generateToken = (
  id: Types.ObjectId,
  jwtSecret: string
): string => {
  return sign({ id }, jwtSecret, { expiresIn: '5d' })
}
