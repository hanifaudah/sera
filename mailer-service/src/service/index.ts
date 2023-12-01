import { Redis } from "ioredis"
import { QueueService } from "./queueService"

export const startServices = async () => {
  await QueueService.getInstance().start()
}

export const stopServices = async () => {
  try {
    await QueueService.getInstance().stop()
  } catch (error) {
    console.error('Error stopping queue service')
  }
}