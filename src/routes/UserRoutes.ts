import express from 'express'

// Controllers
import { register } from '../controllers/UserController'

// Middlewares

const router = express()

router.post('/register', register)

export { router as UserRoutes }
