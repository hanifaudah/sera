import express from 'express'
import bodyParser from 'body-parser'

import 'dotenv/config'

import * as config from './config'
import { api } from './api'

const app = express()

app.use(bodyParser.json())

app.use('/api', api())

app.listen(config.PORT, () => {
  console.log(`API Server started on port ${config.PORT}`)
})

/**
 * TODO: create crud endpoints for email template
 * TODO: create endpoints to send emails
 */
