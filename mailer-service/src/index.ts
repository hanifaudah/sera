import 'dotenv/config'

import { QueueService } from './service/queueService'
import { gracefulShutdown } from './util/gracefulShutdown'

(async () => {
  QueueService.getInstance().start()

  gracefulShutdown()
})()