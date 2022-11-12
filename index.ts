import express, { Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import 'dotenv/config'

const port = process.env.PORT || '5000'
const app = express()

// MongoDB uri
const dbUri = process.env.DB_MONGO_URI

// Allow JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Solve Cors
app.use(cors())

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send(`API is working!`)
})

// Connect to mongoDB database
if (dbUri) {
  mongoose
    .connect(dbUri)
    // eslint-disable-next-line no-console
    .then(() => console.log('Database connection successful!'))
    // eslint-disable-next-line no-console
    .catch(err => console.log(err))
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('App is working!')
})

export { app }
