import { createApp } from './app.js'
import { MotoModel } from './models/mongo/moto.model.js'

import { AuthModel } from './models/mongo/user.model.js'

createApp({ authModel: AuthModel, motoModel: MotoModel })
