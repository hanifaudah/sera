import { Job } from "bullmq";
import { sendMail as sendEmailMailerService } from '../mailerService'

export const emailHandler = async (job: Job): Promise<void> => {
  console.log('Email handler consumed a job', job.data)
  const { to, from, subject, emailString } = job.data

  try {
    await sendEmailMailerService({
      to: to,
      from: from,
      subject: subject,
      emailString: emailString
    })
  } catch (error) {
    console.log('Error', error)
  }
}