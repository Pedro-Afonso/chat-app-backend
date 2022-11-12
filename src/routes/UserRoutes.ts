import express from 'express'

// Controllers
import { login, register } from '../controllers/UserController'

// Middlewares
import {
  loginValidation,
  userCreateValidation
} from '../middlewares/userValidation'
import { handleValidations } from '../middlewares/handleValidations'

const router = express()

router.get('/login', loginValidation(), handleValidations, login)
router.post('/register', userCreateValidation(), handleValidations, register)

export { router as UserRoutes }
