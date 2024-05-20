// import { MotoModel } from '../models/local-file/moto.js'
// import { MotoModel } from '../models/mysql/moto.js'
import { validateMoto, validatePartialMoto } from '../schemas/motos.js'

export class MotoController {
  constructor({ motoModel }) {
    this.motoModel = motoModel
  }

  getAll = async (req, res) => {
    const { brand, city, color } = req.query
    const motos = await this.motoModel.getAll({ brand, city, color })
    res.json(motos)
  }

  getById = async (req, res) => {
    const { id } = req.params
    const moto = await this.motoModel.getById({ id })
    if (moto) return res.json(moto)
    res.status(404).json({ message: 'Moto not found' })
  }

  create = async (req, res) => {
    const result = validateMoto(req.body)

    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const newMoto = await this.motoModel.create({ input: result.data })
    res.status(201).json(newMoto)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const result = await this.motoModel.delete({ id })

    if (result === 0) {
      return res.status(404).json({ message: 'Moto not found' })
    }

    return res.json({ message: 'Moto deleted' })
  }

  update = async (req, res) => {
    const result = validatePartialMoto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedMoto = await this.motoModel.update({ id, input: result.data })
    return res.json(updatedMoto)
  }
}
