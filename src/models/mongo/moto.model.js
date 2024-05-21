import { randomUUID } from 'node:crypto'

import Moto from '../../../config/db/mongo/motoSchema.js'

export class MotoModel {
  static async getAll({ brand, city, color }) {
    let query = {}

    if (brand) {
      query.brand = new RegExp('^' + brand + '$', 'i')
    }

    if (city) {
      query.city = new RegExp('^' + city + '$', 'i')
    }

    if (color) {
      query.color = { $in: [color] }
    }

    const motos = await Moto.find(query)

    return motos
  }

  static async getById({ id }) {
    const moto = await Moto.findOne({ id })

    return moto
  }

  static async create({ input }) {
    const {
      color: colorInput,
      img,
      model,
      description,
      city,
      brand,
      price,
      new: isNewMoto,
      year,
      velMax
    } = input

    const id = randomUUID()

    console.log(id)

    try {
      const createdMoto = await Moto.create({
        id,
        img,
        model,
        description,
        city: city[0],
        brand: brand[0],
        price,
        new: isNewMoto,
        year,
        velMax,
        color: colorInput
      })

      console.log(createdMoto)

      return createdMoto
    } catch (error) {
      console.error(error)
      throw new Error('Error creating moto')
    }
  }

  static async delete({ id }) {
    try {
      const result = await Moto.findOneAndDelete({ id })

      if (!result) return false

      return true
    } catch (error) {
      console.error(error)
      throw new Error('Error deleting moto')
    }
  }

  static async update({ id, input }) {
    const {
      img,
      model,
      description,
      city,
      brand,
      price,
      new: newMoto,
      year,
      velMax
    } = input

    console.log(id)

    try {
      const updatedMoto = await Moto.findOneAndUpdate(
        { id },
        {
          img,
          model,
          description,
          city,
          brand,
          price,
          new: newMoto,
          year,
          velMax
        },
        { new: true }
      )

      if (!updatedMoto) return 'Moto not found'

      return updatedMoto
    } catch (error) {
      console.error(error)
      throw new Error('Error updating moto')
    }
  }
}
