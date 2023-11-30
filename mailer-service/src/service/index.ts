import { QueueService } from "./queueService"

export const startServices = async () => {
  await QueueService.getInstance().start()
}

export const stopServices = async () => {
  await QueueService.getInstance().stop()
}