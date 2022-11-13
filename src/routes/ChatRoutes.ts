import express from 'express'

// Controllers
import { accessChat } from '../controllers/ChatController'

// Middlewares
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/', authGuard, accessChat)

export { router as ChatRoutes }
