/* eslint-disable no-console */
import cors from 'cors'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import 'dotenv/config'

import { router } from './src/routes/Router'

const port = process.env.PORT || '5000'
const app = express()

// MongoDB uri
const dbUri = process.env.DB_MONGO_URI

// Solve Cors
const corsOptions = () => {
  if (process.env.NODE_ENV === 'PRODUCTION') {
    const whitelist = [' https://pedro-afonso-chat-app.netlify.app/chat']

    return {
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      }
    }
  } else {
    return {
      origin: 'http://localhost:5173'
    }
  }
}

app.use(cors(corsOptions()))

// Allow JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send(`API is working!`)
})

app.use(router)

// Connect to mongoDB database
if (dbUri) {
  mongoose
    .connect(dbUri)
    // eslint-disable-next-line no-console
    .then(() => console.log('Database connection successful!'))
    // eslint-disable-next-line no-console
    .catch(err => console.log(err))
}

const httpServer = createServer(app)

const io = new Server(httpServer)

io.on('connection', socket => {
  console.log(`Conectado! ${socket.id}`)

  let userId = ''

  socket.on('setup', user => {
    userId = user._id
    socket.join(userId)

    socket.emit('connected')
  })

  socket.on('join chat', ({ chatId, leave }) => {
    if (leave) {
      socket.leave(leave)
    }
    socket.join(chatId)
    console.log('User Joined Room: ' + chatId)
  })

  socket.on('typing', room => {
    socket.in(room).emit('typing')
  })

  socket.on('stop typing', room => {
    socket.in(room).emit('stop typing')
  })

  socket.on('new message', newMessageReceived => {
    if (!newMessageReceived) {
      console.log('Mensagem vazia!')
      return
    }
    if (!newMessageReceived.chat && !newMessageReceived.chat.users) {
      console.log('Ocorreu um erro!')
      return
    }
    const users = newMessageReceived.chat.users
    users.forEach(({ _id }: any) => {
      if (_id === newMessageReceived.sender._id) return

      socket.in(_id).emit('message received', newMessageReceived)
    })
  })
})

httpServer.listen(port, () => console.log('App is working!'))

export { httpServer as app }
