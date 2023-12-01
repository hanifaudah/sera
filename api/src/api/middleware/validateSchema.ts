import Ajv from 'ajv';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { StandardError } from '../../util/error';

export type SchemaType = {
  body?: any,
  params?: any
}

export const validateSchema = (schema: SchemaType): RequestHandler => {
  const ajv = new Ajv()
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        const validate = ajv.compile(schema.params)

        if (!validate(req.params)) {
          const messages: string[] = []
          if (validate.errors && validate.errors.length) {
            for (const validationError of validate.errors) {
              messages.push(`${validationError.instancePath} ${validationError.message}`.trim())
            }
          }
          throw new StandardError(messages.join(', '), { status: 400 })
        }
      }

      if (schema.body) {
        const validate = ajv.compile(schema.body)

        if (!validate(req.body)) {
          const messages: string[] = []
          if (validate.errors && validate.errors.length) {
            for (const validationError of validate.errors) {
              messages.push(`${validationError.instancePath} ${validationError.message}`.trim())
            }
          }
          throw new StandardError(messages.join(', '), { status: 400 })
        }
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}