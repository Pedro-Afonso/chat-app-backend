import express from 'express'

// Controllers
import {
  accessChat,
  getAllChatsByUser,
  createGroupChat,
  renameGroupChat,
  addToGroup
} from '../controllers/ChatController'

// Middlewares
import {
  createGroupChatValidation,
  renameGroupChatValidation
} from '../middlewares/chatValidation'
import { handleValidations } from '../middlewares/handleValidations'
import { authGuard } from '../middlewares/authGuard'

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

router.put('/group/:groupId/users/:userId', authGuard, addToGroup)

export { router as ChatRoutes }
