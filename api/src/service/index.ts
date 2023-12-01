export * as emailTemplate from './emailTemplate'
export * as sendEmail from './sendEmail'
import { PrismaClient } from '@prisma/client'
import { QueueService } from './queueService'

export const startServices = async (): Promise<void> => {
  console.log('Starting services...')
  const prismaClient = new PrismaClient()
  try {
    await prismaClient.$connect()
    console.log('Connected to database')
  } catch (error) {
    console.log('Error connecting to database')
    process.exit(0)
  }

  await QueueService.getInstance().start()
}