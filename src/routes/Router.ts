import express from 'express'
import { UserRoutes } from './UserRoutes'
import { ChatRoutes } from './ChatRoutes'

const router = express()

router.use('/api/users', UserRoutes)
router.use('/api/chats', ChatRoutes)

export { router }
