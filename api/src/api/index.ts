import { Router } from 'express'
import * as requestHandler from './requestHandler'

export const api = (): Router => {
  const router = Router()

  router.get('/ping', (req, res) => {
    res.send({ pong: 1 })
  })

  router.get('/email-templates', requestHandler.emailTemplate.listEmailTemplates)

  return router
}