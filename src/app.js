import express, { json } from 'express'

import { connectDB } from '../config/db/mongo/index.js'
import { corsMiddleware } from './middlewares/cors.js'

import { createAuthRouter } from './routes/auth.routes.js'
import { createMotoRouter } from './routes/motos.routes.js'

import cookieParser from 'cookie-parser'

export const createApp = async ({ motoModel, authModel }) => {
  const app = express()
  await connectDB()

  app.use(json())
  app.use(corsMiddleware())
  app.use(cookieParser())
  app.disable('x-powered-by')

  app.use('/motos', createMotoRouter({ motoModel }))

  app.use('/api', createAuthRouter({ authModel }))

  const PORT = process.env.PORT ?? 1221

  app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
  })
}
