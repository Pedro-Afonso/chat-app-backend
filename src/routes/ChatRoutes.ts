import express from 'express'

// Controllers
import { accessChat, getAllChatsByUser } from '../controllers/ChatController'
import { createGroupChat } from '../controllers/ChatController/createGroupChat'

// Middlewares
import { authGuard } from '../middlewares/authGuard'
import { createGroupChatValidation } from '../middlewares/chatValidation'
import { handleValidations } from '../middlewares/handleValidations'

const router = express()

router.post('/', authGuard, accessChat)
router.get('/', authGuard, getAllChatsByUser)

//  Create a new group chat
router.post(
  '/group',
  authGuard,
  createGroupChatValidation(),
  handleValidations,
  createGroupChat
)

export { router as ChatRoutes }
