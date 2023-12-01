import nodemailer from 'nodemailer'
import * as config from '../config'
import { StandardError } from '../util/error';

export type SendEmailJobData = {
  to: string,
  from: string,
  subject: string,
  emailString: string
}

export const sendMail = async (data: SendEmailJobData) => {
  if (config.SMTP_HOST === undefined || config.SMTP_HOST === null) {
    throw new StandardError('SMTP_HOST is not defined', { status: 500 })
  }
  if (config.SMTP_PORT === undefined || config.SMTP_PORT === null) {
    throw new StandardError('SMTP_PORT is not defined', { status: 500 })
  }
  const transporter = nodemailer.createTransport({
    options: {
      host: config.SMTP_HOST,
      port: parseInt(config.SMTP_PORT)
    },
    secure: true,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: data.from,
    to: data.to,
    subject: data.subject,
    text: data.emailString
  });

  console.log("Message sent: %s", info.messageId);
}