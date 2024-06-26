import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/utils.js'

const motos = readJSON('../../config/db/motos.json')

export class MotoModel {
  static async getAll({ brand, city, color }) {
    if (brand) {
      return motos.filter((moto) => {
        if (typeof moto.brand === 'string') {
          return moto.brand.toLowerCase() === brand.toLowerCase()
        }
        return false
      })
    }

    if (city) {
      return motos.filter((moto) => {
        if (typeof moto.city === 'string') {
          return moto.city.toLowerCase() === city.toLowerCase()
        }
        return false
      })
    }

    if (color) {
      return motos.filter((moto) => moto.color.includes(color))
    }

    return motos
  }

  static async getById({ id }) {
    const moto = motos.find((moto) => moto.id === id)
    return moto
  }

  static async create({ input }) {
    const newMoto = {
      id: randomUUID(),
      ...input
    }

    motos.push(newMoto)

    return newMoto
  }

  static async delete({ id }) {
    const motoIndex = motos.findIndex((moto) => moto.id === id)

    if (motoIndex === -1) return false

    motos.splice(motoIndex, 1)

    return true
  }

  static async update({ id, input }) {
    const motoIndex = motos.findIndex((moto) => moto.id === id)
    if (motoIndex === -1) return false

    motos[motoIndex] = {
      ...motos[motoIndex],
      ...input
    }

    return motos[motoIndex]
  }
}
