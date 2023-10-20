import { Router } from 'express'

import { MotoController } from '../controllers/moto.js'
export const motosRouter = Router()

motosRouter.get('/', MotoController.getAll)
motosRouter.get('/:id', MotoController.getById)

motosRouter.post('/', MotoController.create)
motosRouter.delete('/:id', MotoController.delete)
motosRouter.patch('/:id', MotoController.update)
