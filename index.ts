import express, { Request, Response } from 'express'
import cors from 'cors'

const port = process.env.PORT || '5000'
const app = express()

// Allow JSON and form data
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Solve Cors
app.use(cors())

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send(`API is working!`)
})

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log('App is working!')
})

export { app }
