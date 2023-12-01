import { NextFunction, Request, Response } from 'express'
import { EmailTemplate } from '@prisma/client'
import * as service from '../../service'
import { SchemaType } from '../middleware/validateSchema'
import { CreateEmailTemplateData } from '../../service/emailTemplate'
import { JSONSchemaType } from 'ajv'

export namespace schema {
  export const createEmailTemplate = (): SchemaType => {
    const bodySchema: JSONSchemaType<{ email_template: CreateEmailTemplateData }> = {
      type: 'object',
      properties: {
        email_template: {
          type: 'object',
          properties: {
            slug: { type: 'string', minLength: 3 },
            template: { type: 'string' }
          },
          required: ['slug', 'template'],
        },
      },
      required: ['email_template'],
      additionalProperties: false
    }

    return {
      body: bodySchema
    }
  }
}

export const listEmailTemplates = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  const emailTemplates: EmailTemplate[] = await service.emailTemplate.listEmailTemplates()
  res.send({
    emailTemplates
  })
}

export const createEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  const { email_template: { slug, template } } = req.body
  const emailTemplate = await service.emailTemplate.createEmailTemplate({ slug, template })
  res.send({
    emailTemplate
  })
}

export const retrieveEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  // TODO: implement
}

export const updateEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  // TODO: implement
}

export const deleteEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  // TODO: implement
}