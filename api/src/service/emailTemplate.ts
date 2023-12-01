import { EmailTemplate, PrismaClient } from '@prisma/client'
import { compile } from 'handlebars'
import { StandardError } from '../util/error'

const validateSlug = async (slug: string): Promise<void> => {
  if (!slug.match(/^[a-z0-9-]+[a-z0-9]+$/)) {
    throw new StandardError('Invalid slug format, follow this pattern: /^[a-z0-9-]+[a-z0-9]+$/', { status: 400 })
  }

  const prismaClient = new PrismaClient()
  const slugCount = await prismaClient.emailTemplate.count({
    where: {
      slug: slug
    }
  })

  if (slugCount > 0) {
    throw new StandardError('Slug already exists', { status: 400 })
  }
}

const validateTemplate = (template: string): void => {
  try {
    compile(template)
  } catch (error) {
    throw new StandardError('Invalid template string', { status: 400 })
  }
}

export const listEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const prismaClient = new PrismaClient()
  const emailTemplates = await prismaClient.emailTemplate.findMany()
  return emailTemplates
}

export type CreateEmailTemplateData = {
  slug: string,
  template: string
}

export const createEmailTemplate = async (data: CreateEmailTemplateData): Promise<EmailTemplate> => {
  await validateSlug(data.slug)
  validateTemplate(data.template)

  const prismaClient = new PrismaClient()

  const emailTemplate = await prismaClient.emailTemplate.create({
    data: { ...data }
  })

  return emailTemplate
}

export const retrieveEmailTemplate = async (id: number): Promise<EmailTemplate> => {
  const prismaClient = new PrismaClient()

  const emailTemplate: EmailTemplate | null = await prismaClient.emailTemplate.findUnique({
    where: {
      id: id
    }
  })

  if (emailTemplate === null) {
    throw new StandardError('Email template not found', { status: 404 })
  }

  return emailTemplate
}

export type UpdateEmailTemplateData = Partial<CreateEmailTemplateData>

export const updateEmailTemplate = async (id: number, data: UpdateEmailTemplateData): Promise<EmailTemplate> => {
  if (data?.template !== undefined) {
    validateTemplate(data.template)
  }

  const prismaClient = new PrismaClient()

  // validate existence
  const existingEmailTemplate: EmailTemplate = await retrieveEmailTemplate(id)

  if (data?.slug !== undefined && data.slug !== existingEmailTemplate.slug) {
    await validateSlug(data.slug)
  }

  const emailTemplate: EmailTemplate = await prismaClient.emailTemplate.update({
    where: {
      id: id
    },
    data: { ...data }
  })

  return emailTemplate
}

export const deleteEmailTemplate = async (id: number): Promise<EmailTemplate> => {
  const prismaClient = new PrismaClient()

  // validate existence
  await retrieveEmailTemplate(id)

  const emailTemplate: EmailTemplate = await prismaClient.emailTemplate.delete({
    where: {
      id: id
    }
  })

  return emailTemplate
}