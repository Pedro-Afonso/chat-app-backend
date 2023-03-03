/* eslint-disable no-console */
import cors from 'cors'
import express, { Request, Response } from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import 'dotenv/config'

import { AppSocket } from './src/config/AppSocket'

import { router } from './src/routes/Router'

const port = process.env.PORT || '5000'
const app = express()

// MongoDB uri
const dbUri = process.env.DB_MONGO_URI

// Solve Cors
const corsOptions = () => {
  if (process.env.NODE_ENV === 'PRODUCTION') {
    const whitelist = ['https://pedro-afonso-chat-app.netlify.app']

    return {
      origin: function (origin: any, callback: any) {
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

const io = new Server(httpServer, {
  cors: { origin: [process.env.ALLOWED_ORIGIN_1 || 'http://localhost:5173'] }
})

httpServer.listen(port, () => {
  AppSocket({ io })
  console.log('App is working!')
})

export { httpServer as app }
