import express from 'express'

// Controllers
import {
  sendMessage,
  getAllMessagesByChat
} from '../controllers/MessageController'

// Middlewares
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/', authGuard, sendMessage)
router.get('/chat/:chatId', authGuard, getAllMessagesByChat)

export { router as MessageRoutes }
