import { EmailTemplate, PrismaClient } from '@prisma/client'

export const listEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const prismaClient = new PrismaClient()
  const emailTemplates = await prismaClient.emailTemplate.findMany()
  return emailTemplates
}