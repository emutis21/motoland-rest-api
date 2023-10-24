import { MotoModel } from '../models/local-file/moto.js'
import { validateMoto, validatePartialMoto } from '../schemas/motos.js'

export class MotoController {
  static async getAll (req, res) {
    const { brand, city, color } = req.query
    const motos = await MotoModel.getAll({ brand, city, color })
    res.json(motos)
  }

  static async getById (req, res) {
    const { id } = req.params
    const moto = await MotoModel.getById({ id })
    if (moto) return res.json(moto)
    res.status(404).json({ message: 'Moto not found' })
  }

  static async create (req, res) {
    const result = validateMoto(req.body)

    if (result.error) {
      return res.status(400).json({ message: JSON.parse(result.error.message) })
    }

    const newMoto = await MotoModel.create({ input: result.data })
    res.status(201).json(newMoto)
  }

  static async delete (req, res) {
    const { id } = req.params
    const result = await MotoModel.delete({ id })

    if (result === false) {
      return res.status(404).json({ message: 'Moto not found' })
    }

    return res.json({ message: 'Moto deleted' })
  }

  static async update (req, res) {
    const result = validatePartialMoto(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse3(result.error.message) })
    }

    const { id } = req.params
    const updatedMoto = await MotoModel.update({ id, input: result.data })
    return res.json(updatedMoto)
  }
}
