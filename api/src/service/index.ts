export * as emailTemplate from './emailTemplate'
import { PrismaClient } from '@prisma/client'

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
}