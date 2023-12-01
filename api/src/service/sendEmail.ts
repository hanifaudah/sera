import { EmailTemplate } from '@prisma/client'
import { compile } from 'handlebars'
import { retrieveEmailTemplate } from './emailTemplate'
import { QueueService, SendEmailJobData } from './queueService'
import * as config from '../config'
import { StandardError } from '../util/error'

export type SendEmailData = {
  emailTemplateId: number
  to: string,
  subject: string,
  parameters: Record<string, string>
}

export const sendEmail = async (data: SendEmailData): Promise<SendEmailJobData> => {
  const { emailTemplateId, to, subject, parameters } = data
  const emailTemplate: EmailTemplate = await retrieveEmailTemplate(emailTemplateId)

  const template = compile(emailTemplate.template)
  const emailString = template(parameters)
  console.log('[HANIF DEBUG]', emailTemplate.template)
  console.log('[HANIF DEBUG]', parameters)

  if (config.MAILER_FROM === undefined) {
    throw new StandardError('MAILER_FROM not set', { status: 500 })
  }

  const emailJobData = {
    to,
    from: config.MAILER_FROM,
    subject,
    emailString: emailString
  }

  await QueueService.getInstance().sendEmail(emailJobData)

  return emailJobData
}