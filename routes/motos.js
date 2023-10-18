import { randomUUID } from 'node:crypto'

import { Router } from 'express'

import { validateMoto, validatePartialMoto } from '../schemas/motos.js'
import { readJSON } from '../utils.js'

const motos = readJSON('./motos.json')
export const motosRouter = Router()

motosRouter.get('/', async (req, res) => {
  const { brand, city, color } = req.query

  const motos = await MotoModel.getAll({ brand, city, color })

  res.json(motos)
})

motosRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const moto = motos.find((moto) => moto.id == id)
  if (moto) return res.json(moto)

  res.status(404).json({ message: 'Moto not found' })
})

motosRouter.post('/', (req, res) => {
  const result = validateMoto(req.body)

  if (result.error) {
    return res.status(400).json({ message: JSON.parse(result.error.message) })
  }

  const newMoto = {
    id: randomUUID(),
    ...result.data,
  }

  motos.push(newMoto)

  res.status(201).json(newMoto)
})

motosRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const motoIndex = motos.findIndex((moto) => moto.id == id)

  if (motoIndex === -1) {
    return res.status(404).json({ message: 'Moto not found' })
  }

  motos.splice(motoIndex, 1)

  return res.json({ message: 'Moto deleted' })
})

motosRouter.patch('/:id', (req, res) => {
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
