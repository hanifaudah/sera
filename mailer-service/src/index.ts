import 'dotenv/config'

import { gracefulShutdown } from './util/gracefulShutdown'
import { startServices } from './service'

(async () => {
  await startServices()

  gracefulShutdown()
})()