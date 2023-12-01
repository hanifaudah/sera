import { NextFunction, Request, Response } from 'express'
import { EmailTemplate } from '@prisma/client'
import * as service from '../../service'
import { SchemaType } from '../middleware/validateSchema'
import { CreateEmailTemplateData, UpdateEmailTemplateData } from '../../service/emailTemplate'
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

  export const retrieveEmailTemplate = (): SchemaType => {
    const paramsSchema: JSONSchemaType<{ emailTemplateId: string }> = {
      type: 'object',
      properties: {
        emailTemplateId: { type: 'string' }
      },
      required: ['emailTemplateId']
    }

    return {
      params: paramsSchema
    }
  }

  export const updateEmailTemplate = (): SchemaType => {
    const paramsSchema: JSONSchemaType<{ emailTemplateId: string }> = {
      type: 'object',
      properties: {
        emailTemplateId: { type: 'string' }
      },
      required: ['emailTemplateId']
    }

    const bodySchema: JSONSchemaType<{ email_template: UpdateEmailTemplateData }> = {
      type: 'object',
      properties: {
        email_template: {
          type: 'object',
          properties: {
            slug: { type: 'string', minLength: 3, nullable: true },
            template: { type: 'string', nullable: true }
          }
        },
      },
      required: ['email_template'],
      additionalProperties: false
    }

    return {
      params: paramsSchema,
      body: bodySchema
    }
  }

  export const deleteEmailTemplate = (): SchemaType => {
    const paramsSchema: JSONSchemaType<{ emailTemplateId: string }> = {
      type: 'object',
      properties: {
        emailTemplateId: { type: 'string' }
      },
      required: ['emailTemplateId']
    }

    return {
      params: paramsSchema
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
  const { emailTemplateId } = req.params
  const emailTemplate = await service.emailTemplate.retrieveEmailTemplate(parseInt(emailTemplateId))
  res.send({
    emailTemplate
  })
}

export const updateEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  const { emailTemplateId } = req.params
  const { email_template: data } = req.body
  const emailTemplate = await service.emailTemplate.updateEmailTemplate(parseInt(emailTemplateId), data)
  res.send({
    emailTemplate
  })
}

export const deleteEmailTemplate = async (req: Request, res: Response, _: NextFunction): Promise<void> => {
  const { emailTemplateId } = req.params
  const emailTemplate = await service.emailTemplate.deleteEmailTemplate(parseInt(emailTemplateId))
  res.send({
    emailTemplate
  })
}