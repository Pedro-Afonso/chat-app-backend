import express from 'express'

// Controllers
import {
  accessChat,
  getAllChatsByUser,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup
} from '../controllers/ChatController'

// Middlewares
import {
  createGroupChatValidation,
  renameGroupChatValidation
} from '../middlewares/chatValidation'
import { handleValidations } from '../middlewares/handleValidations'
import { errorHandler } from '../middlewares/errorHandler'
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

router.put('/group/:groupId/users/:userId', authGuard, addToGroup)
router.put(
  '/group/:id',
  authGuard,
  renameGroupChatValidation(),
  handleValidations,
  renameGroupChat
)

router.delete('/group/:groupId/users/:userId', authGuard, removeFromGroup)

router.use(errorHandler)

export { router as ChatRoutes }
