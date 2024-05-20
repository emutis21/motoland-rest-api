import { createApp } from './app.js'

import { AuthModel } from './models/mongo/user.model.js'

createApp({ authModel: AuthModel })
