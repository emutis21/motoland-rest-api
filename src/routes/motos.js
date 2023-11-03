import { Router } from 'express'
import { MotoController } from '../controllers/moto.js'

export const createMotoRouter = ({ motoModel }) => {
  const motosRouter = Router()

  const motoController = new MotoController({ motoModel })

  motosRouter.get('/', motoController.getAll)
  motosRouter.get('/:id', motoController.getById)

  motosRouter.post('/', motoController.create)
  motosRouter.delete('/:id', motoController.delete)
  motosRouter.patch('/:id', motoController.update)

  return motosRouter
}
