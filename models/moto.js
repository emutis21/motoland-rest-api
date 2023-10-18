import { readJSON } from '../utils'

const motos = readJSON('./motos.json')

export class MovieModel {
  static async getAll({ brand, city, color }) {
    if (brand) {
      return motos.filter((moto) => moto.brand.includes(brand))
    }
    if (city) {
      return motos.filter((moto) => moto.city.includes(city))
    }
    if (color) {
      return motos.filter((moto) => moto.color.includes(color))
    }

    return motos
  }

  static async getById({ id }) {
    const moto = motos.find((moto) => moto.id == id)
    return moto
  }

  static async create(input) {
    const newMoto = {
      id: randomUUID(),
      ...input,
    }

    motos.push(newMoto)

    return newMoto
    
  }
}
