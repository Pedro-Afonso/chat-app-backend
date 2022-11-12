import express from 'express'

// Controllers
import { register } from '../controllers/UserController'

// Middlewares
import { handleValidations } from '../middlewares/handleValidations'
import { userCreateValidation } from '../middlewares/userValidation'

const router = express()

router.post('/register', userCreateValidation(), handleValidations, register)

export { router as UserRoutes }
