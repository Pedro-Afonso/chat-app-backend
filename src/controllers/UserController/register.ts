import { Request, Response } from 'express'

import { hashPassword, generateToken } from '../../utils'
import { cloudinary } from '../../config/cloudinary'
import { UserModel } from '../../models/UserModel'
import { AppError } from '../../config/AppError'
import { tryCatch } from '../../utils/tryCatch'

interface IData {
  name: string
  email: string
  password: string
  profileImage?: string
}

/**
  @description     Register a user
  @route           POST /api/users/register
  @access          Public
 */
export const register = tryCatch(
  async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body

    // Check if user exists
    const user = await UserModel.findOne({ email })

    const jwtSecret = process.env.JWT_SECRET

    if (user) {
      throw new AppError(
        422,
        'Já existe um usuário cadastrado com esse e-mail.'
      )
    }

    // Generate password hash
    const passwordHash = await hashPassword(password)

    const data: IData = {
      name,
      email,
      password: passwordHash
    }

    if (req.file) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: 'chat-app',
          resource_type: 'image'
        })
        data.profileImage = uploadedImage.secure_url
      } catch {
        throw new AppError(422, 'Houve um erro ao enviar a imagem!')
      }
    }

    // Create user
    const newUser = await UserModel.create(data)

    // Check if user was created sucessfully
    if (!newUser || !jwtSecret) {
      throw new AppError(422)
    }

    // Return the token
    res.status(201).json({
      _id: newUser._id,
      token: generateToken(newUser._id, jwtSecret)
    })
  }
)
