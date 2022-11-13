import express from 'express'
import { UserRoutes } from './UserRoutes'
import { ChatRoutes } from './ChatRoutes'
import { MessageRoutes } from './MessageRoutes'

const router = express()

router.use('/api/users', UserRoutes)
router.use('/api/chats', ChatRoutes)
router.use('/api/messages', MessageRoutes)

export { router }
