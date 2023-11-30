import { Job } from "bullmq";

export const emailHandler = async (job: Job): Promise<void> => {
  console.log(job.data)
}