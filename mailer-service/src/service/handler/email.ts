import { Job } from "bullmq";

export const emailHandler = async (job: Job): Promise<void> => {
  console.log('Email handler consumed a job')
  console.log(job.data)
}