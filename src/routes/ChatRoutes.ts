import express from 'express'

// Controllers
import {
  accessChat,
  getAllChatsByUser,
  createGroupChat,
  renameGroupChat
} from '../controllers/ChatController'

// Middlewares
import { authGuard } from '../middlewares/authGuard'
import {
  createGroupChatValidation,
  renameGroupChatValidation
} from '../middlewares/chatValidation'
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

router.put(
  '/group/:id',
  authGuard,
  renameGroupChatValidation(),
  handleValidations,
  renameGroupChat
)

export { router as ChatRoutes }
