import { Request, Response } from 'express'
import { EmailTemplate } from '@prisma/client'
import * as service from '../../service'

export const listEmailTemplates = async (req: Request, res: Response): Promise<Response> => {
  const emailTemplates: EmailTemplate[] = await service.emailTemplate.listEmailTemplates()
  return res.send({
    emailTemplates
  })
}