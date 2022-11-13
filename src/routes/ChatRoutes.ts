import express from 'express'

// Controllers
import { accessChat, getAllChatsByUser } from '../controllers/ChatController'

// Middlewares
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/', authGuard, accessChat)
router.get('/', authGuard, getAllChatsByUser)

export { router as ChatRoutes }
