const express = require('express')
const crypto = require('node:crypto')
const cors = require('cors')

const motos = require('./motos.json')
const { validateMoto, validatePartialMoto } = require('./schemas/motos')

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:5173',
        'http://localhost:1221',
        'http://localhost:8080',
        'https://emutis21.github.io/motoland/',
      ]

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.disable('x-powered-by')

app.get('/motos', (req, res) => {
  const { brand, city, color } = req.query

  const filteredMotos = motos.filter(
    (moto) =>
      (!brand || moto.brand.toLowerCase() === brand.toLowerCase()) &&
      (!city || moto.city.toLowerCase() === city.toLowerCase()) &&
      (!color || moto.color.includes(color.toLowerCase())),
  )

  res.json(filteredMotos)
})

app.get('/motos/:id', (req, res) => {
  const { id } = req.params
  const moto = motos.find((moto) => moto.id == id)
  if (moto) return res.json(moto)

  res.status(404).json({ message: 'Moto not found' })
})

app.post('/motos', (req, res) => {
  const result = validateMoto(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMoto = {
    id: crypto.randomUUID(),
    ...result.data,
  }

  motos.push(newMoto)

  res.status(201).json(newMoto)
})

app.delete('/motos/:id', (req, res) => {
  const { id } = req.params
  const motoIndex = motos.findIndex((moto) => moto.id == id)

  if (motoIndex === -1) {
    return res.status(404).json({ message: 'Moto not found' })
  }

  motos.splice(motoIndex, 1)

  return res.json({ message: 'Moto deleted' })
})

app.patch('/motos/:id', (req, res) => {
  const result = validatePartialMoto(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const motoIndex = motos.findIndex((moto) => moto.id == id)

  if (motoIndex === -1) {
    return res.status(404).json({ message: 'Moto not found' })
  }

  const updateMoto = {
    ...motos[motoIndex],
    ...result.data,
  }

  motos[motoIndex] = updateMoto

  return res.json(updateMoto)
})

const PORT = process.env.PORT ?? 1221

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})

app.use((req, res, next) => {
  console.log(req.body)
  next()
})
