import express from 'express'

// Controllers
import {
  sendMessage,
  getAllMessagesByChat
} from '../controllers/MessageController'

// Middlewares
import { errorHandler } from '../middlewares/errorHandler'
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/', authGuard, sendMessage)
router.get('/chat/:chatId', authGuard, getAllMessagesByChat)

router.use(errorHandler)

export { router as MessageRoutes }
