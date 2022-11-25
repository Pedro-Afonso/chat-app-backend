import express from 'express'

// Controllers
import {
  login,
  register,
  searchUsers,
  getCurrentUser
} from '../controllers/UserController'

// Middlewares
import {
  loginValidation,
  userCreateValidation
} from '../middlewares/userValidation'
import { handleValidations } from '../middlewares/handleValidations'
import { errorHandler } from '../middlewares/errorHandler'
import { imageUpload } from '../middlewares/imageUpload'
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/login', loginValidation(), handleValidations, login)
router.get('/search', authGuard, searchUsers)
router.post(
  '/',
  imageUpload.single('profileImage'),
  userCreateValidation(),
  handleValidations,
  register
)
router.get('/', authGuard, getCurrentUser)

router.use(errorHandler)

export { router as UserRoutes }
