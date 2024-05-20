import User from '../../../config/db/mongo/userSchema.js'
import bcrypt from 'bcryptjs/dist/bcrypt.js'
import { createAccessToken } from '../../utils/jwt.js'

export class AuthModel {
  static async create({ username, email, password }) {
    try {
      const passwordHash = await bcrypt.hash(password, 10)
      const newUser = new User({ username, email, password: passwordHash })

      const userSaved = await newUser.save()

      return userSaved
    } catch (error) {
      throw new Error(`Error creating user: ${error}`)
    }
  }

  static async login({ email, password }) {
    try {
      const userFound = await User.findOne({ email })

      if (!userFound) {
        throw new Error('User not found')
      }

      const isMatch = await bcrypt.compare(password, userFound.password)

      if (!isMatch) throw new Error('Invalid credentials')

      const token = await createAccessToken({ id: userFound._id })

      return {
        token,
        user: {
          id: userFound._id,
          username: userFound.username,
          email: userFound.email,
          createdAt: userFound.createdAt,
          updatedAt: userFound.updatedAt
        }
      }
    } catch (error) {
      throw new Error(`Error logging in: ${error}`)
    }
  }

  static async logout() {
    try {
      return { message: 'Logged out' }
    } catch (error) {
      throw new Error(`Error logging out: ${error}`)
    }
  }

  static async getProfile({ id }) {
    try {
      const userFound = await User.findById(id)

      if (!userFound) throw new Error('User not found')

      return {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
      }
    } catch (error) {
      throw new Error(`Error getting user profile: ${error}`)
    }
  }

  static async findById({ id }) {
    try {
      const userFound = await User.findById(id)

      if (!userFound) {
        throw new Error('User not found')
      }

      return {
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt
      }
    } catch (error) {
      throw new Error(`Error finding user by id: ${error}`)
    }
  }
}
