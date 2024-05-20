import { createAccessToken } from '../utils/jwt.js'

export class AuthController {
  constructor({ authModel }) {
    this.authModel = authModel
  }

  register = async (req, res) => {
    const { username, email, password } = req.body

    try {
      const user = await this.authModel.create({ username, email, password })
      const token = await createAccessToken({ id: user.id })

      res.cookie('token', token, {
        httpOnly: true
      })

      res.status(201).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  login = async (req, res) => {
    const { email, password } = req.body

    try {
      const { user } = await this.authModel.login({ email, password })

      const token = await createAccessToken({ id: user.id })

      if (!token) throw new Error('Error creating access token')

      res.cookie('token', token, { httpOnly: true })

      res.status(200).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  logout = async (_, res) => {
    try {
      const logoutMessage = await this.authModel.logout()

      res.cookie('token', '', { maxAge: 0 })

      res.status(200).json(logoutMessage)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  profile = async (req, res) => {
    try {
      const realUserId = req.user

      const userDetails = await this.authModel.findById(realUserId)

      res.json(userDetails)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }

  getUser = async (req, res) => {
    try {
      const user = await this.authModel.findById(req.user.id)
      res.json(user)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}
