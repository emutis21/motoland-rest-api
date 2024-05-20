import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: '1234',
  database: 'motosdb'
}

const connection = await mysql.createConnection(config)

export class MotoModel {
  static async getAll({ color, city, brand }) {
    if (brand) {
      const lowerCaseBrand = brand.toLowerCase()

      const [motos] = await connection.query(
        'SELECT img, model, description, city, brand, price, new, year, velMax, BIN_TO_UUID(id) AS id FROM moto WHERE LOWER(brand) = ?',
        [lowerCaseBrand]
      )

      return motos
    }

    if (city) {
      const lowerCaseCity = city.toLowerCase()

      const [motos] = await connection.query(
        'SELECT img, model, description, city, brand, price, new, year, velMax, BIN_TO_UUID(id) AS id FROM moto WHERE LOWER(city) = ?',
        [lowerCaseCity]
      )

      return motos
    }

    if (color) {
      const lowerCaseColor = color.toLowerCase()

      const [colors] = await connection.query(
        'SELECT id, name FROM color WHERE LOWER(name) = ?',
        [lowerCaseColor]
      )

      if (colors.length === 0) return []

      const [{ id }] = colors

      const [motos] = await connection.query(
        'SELECT m.img, m.model, m.description, m.city, m.brand, m.price, m.new, m.year, m.velMax, BIN_TO_UUID(m.id) AS id FROM moto m JOIN moto_color mc ON m.id = mc.moto_id JOIN color c ON mc.color_id = c.id WHERE c.id = ?',
        [id]
      )

      return motos
    }
    const [motos] = await connection.query(
      'SELECT m.img, m.model, m.description, m.city, m.brand, m.price, m.new, m.year, m.velMax, BIN_TO_UUID(m.id) id, GROUP_CONCAT(c.name) AS color FROM moto m LEFT JOIN moto_color mc ON m.id = mc.moto_id LEFT JOIN color c ON mc.color_id = c.id GROUP BY m.id'
    )

    return motos
  }

  static async getById({ id }) {
    const [motos] = await connection.query(
      'SELECT img, model, description, city, brand, price, new, year, velMax, BIN_TO_UUID(id) id FROM moto WHERE id = UUID_TO_BIN(?)',
      [id]
    )

    if (motos.length === 0) return null

    return motos[0]
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
      new: newMoto,
      year,
      velMax
    } = input

    try {
      const [uuidResult] = await connection.query('SELECT UUID() uuid')
      const [{ uuid }] = uuidResult

      await connection.query(
        'INSERT INTO moto (id, img, model, description, city, brand, price, new, year, velMax) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          uuid,
          img,
          model,
          description,
          city,
          brand,
          price,
          newMoto,
          year,
          velMax
        ]
      )

      const [colors] = await connection.query(
        'SELECT id, name FROM color WHERE name IN (?)',
        [colorInput]
      )
      const colorIds = colors.map(({ id }) => id)

      const colorPromises = colorIds.map((colorId) => {
        return connection.query(
          'INSERT INTO moto_color (moto_id, color_id) VALUES (UUID_TO_BIN(?), ?)',
          [uuid, colorId]
        )
      })

      await Promise.all(colorPromises)

      const [motos] = await connection.query(
        'SELECT m.img, m.model, m.description, m.city, m.brand, m.price, m.new, m.year, m.velMax, BIN_TO_UUID(m.id) id, c.name AS color FROM moto m JOIN moto_color mc ON m.id = mc.moto_id JOIN color c ON mc.color_id = c.id WHERE m.id = UUID_TO_BIN(?)',
        [uuid]
      )

      if (motos.length === 0) {
        throw new Error('Moto not found')
      }

      const moto = motos[0]
      moto.color = colorInput
      return moto
    } catch (e) {
      console.error(e)
      throw new Error('Error creating moto')
    }
  }

  static async delete({ id }) {
    try {
      await connection.query(
        'DELETE FROM moto_color WHERE moto_id = UUID_TO_BIN(?)',
        [id]
      )
      await connection.query('DELETE FROM moto WHERE id = UUID_TO_BIN(?)', [id])
      return true
    } catch (e) {
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

    try {
      const [moto] = await connection.query(
        'SELECT id, img, model, description, city, brand, price, new, year, velMax FROM moto WHERE id = UUID_TO_BIN(?)',
        [id]
      )

      if (moto.length === 0) {
        return false
      }

      const updatedMoto = {
        img: img || moto[0].img,
        model: model || moto[0].model,
        description: description || moto[0].description,
        city: city || moto[0].city,
        brand: brand || moto[0].brand,
        price: price || moto[0].price,
        new: newMoto || moto[0].new,
        year: year || moto[0].year,
        velMax: velMax || moto[0].velMax
      }

      const updateQuery = `
        UPDATE moto
        SET
          img = ?,
          model = ?,
          description = ?,
          city = ?,
          brand = ?,
          price = ?,
          new = ?,
          year = ?,
          velMax = ?
        WHERE id = UUID_TO_BIN(?)
      `

      await connection.query(updateQuery, [
        updatedMoto.img,
        updatedMoto.model,
        updatedMoto.description,
        updatedMoto.city,
        updatedMoto.brand,
        updatedMoto.price,
        updatedMoto.new,
        updatedMoto.year,
        updatedMoto.velMax,
        id
      ])

      const [finalMoto] = await connection.query(
        'SELECT id, img, model, description, city, brand, price, new, year, velMax FROM moto WHERE id = UUID_TO_BIN(?)',
        [id]
      )

      finalMoto[0].id = id
      return finalMoto[0]
    } catch (error) {
      // console.error(error)
      throw new Error('Error updating moto')
    }
  }
}
