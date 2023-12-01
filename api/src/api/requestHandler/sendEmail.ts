import { NextFunction, Request, Response } from 'express'
import { SchemaType } from '../middleware/validateSchema'
import { JSONSchemaType } from 'ajv'
import { SendEmailData } from '../../service/sendEmail'
import * as service from '../../service'

export namespace schema {
  export const sendEmail = (): SchemaType => {
    const bodySchema: JSONSchemaType<{ email: SendEmailData }> = {
      type: 'object',
      properties: {
        email: {
          type: 'object',
          properties: {
            emailTemplateId: { type: 'number' },
            to: { type: 'string' },
            subject: { type: 'string' },
            parameters: {
              type: 'object',
              additionalProperties: { type: 'string' },
              required: []
            },
          },
          required: ['emailTemplateId', 'to', 'subject', 'parameters'],
          additionalProperties: false,
        }
      },
      required: ['email']
    }

    return {
      body: bodySchema
    }
  }
}

export const sendEmail = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  const { email: { emailTemplateId, to, subject, parameters } } = req.body
  const emailJobData = await service.sendEmail.sendEmail({
    emailTemplateId: parseInt(emailTemplateId),
    to: to,
    subject: subject,
    parameters: parameters
  })
  res.send({
    success: true,
    emailJobData
  })
}