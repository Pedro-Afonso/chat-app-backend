import express from 'express'

// Controllers
import { login, register, searchUsers } from '../controllers/UserController'

// Middlewares
import {
  loginValidation,
  userCreateValidation
} from '../middlewares/userValidation'
import { handleValidations } from '../middlewares/handleValidations'
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/login', loginValidation(), handleValidations, login)
router.get('/search', authGuard, searchUsers)
router.post('/', userCreateValidation(), handleValidations, register)

export { router as UserRoutes }
