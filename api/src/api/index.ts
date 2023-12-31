import { NextFunction, Router, Request, Response } from 'express'
import * as requestHandler from './requestHandler'
import { requestHandlerWrapper } from '../util/requestHandlerWrapper'
import { StandardError } from '../util/error'
import { validateSchema } from './middleware/validateSchema'

export const api = (): Router => {
  const router = Router()

  router.get('/ping', (req, res) => {
    res.send({ pong: 1 })
  })

  // Email template CRUD endpoints
  router.get('/email-templates', requestHandlerWrapper(requestHandler.emailTemplate.listEmailTemplates))
  router.post('/email-template', validateSchema(requestHandler.emailTemplate.schema.createEmailTemplate()), requestHandlerWrapper(requestHandler.emailTemplate.createEmailTemplate))
  router.get('/email-template/:emailTemplateId', validateSchema(requestHandler.emailTemplate.schema.retrieveEmailTemplate()), requestHandlerWrapper(requestHandler.emailTemplate.retrieveEmailTemplate))
  router.patch('/email-template/:emailTemplateId', validateSchema(requestHandler.emailTemplate.schema.updateEmailTemplate()), requestHandlerWrapper(requestHandler.emailTemplate.updateEmailTemplate))
  router.delete('/email-template/:emailTemplateId', validateSchema(requestHandler.emailTemplate.schema.deleteEmailTemplate()), requestHandlerWrapper(requestHandler.emailTemplate.deleteEmailTemplate))

  // Send email endpoints
  router.post('/send-email', validateSchema(requestHandler.sendEmail.schema.sendEmail()), requestHandlerWrapper(requestHandler.sendEmail.sendEmail))

  router.use((error: Error, _1: Request, res: Response, _2: NextFunction) => {
    if (error instanceof StandardError) {
      return res.status(error.data.status).send({
        status: error.data.status,
        error: {
          message: error.message
        }
      })
    }

    console.log('Error', error)

    return res.status(500).send({
      status: 500,
      error: {
        message: 'Unexpected server error'
      }
    })
  })
  return router
}