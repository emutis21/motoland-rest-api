import express, { json } from 'express'

import { corsMiddleware } from './middlewares/cors.js'
import { motosRouter } from './routes/motos.js'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/motos', motosRouter)

const PORT = process.env.PORT ?? 1221

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})

app.use((req, res, next) => {
  console.log(req.body)
  next()
})
