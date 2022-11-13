import express from 'express'

// Controllers
import { sendMessage } from '../controllers/MessageController'

// Middlewares
import { authGuard } from '../middlewares/authGuard'

const router = express()

router.post('/', authGuard, sendMessage)

export { router as MessageRoutes }
