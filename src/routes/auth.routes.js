import { Router } from 'express'
import { AuthController } from '../controllers/auth.controller.js'
import { authRequired } from '../middlewares/validateToken.js'

export const createAuthRouter = ({ authModel }) => {
  const authRouter = Router()

  const authController = new AuthController({ authModel })

  authRouter.post('/register', authController.register)
  authRouter.post('/login', authController.login)
  authRouter.post('/logout', authController.logout)
  authRouter.get('/user', authController.getUser)
  authRouter.get('/profile', authRequired, authController.profile)

  return authRouter
}
