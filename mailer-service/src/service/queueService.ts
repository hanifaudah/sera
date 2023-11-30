import { Worker, Queue, Processor } from 'bullmq'
import { emailHandler } from './handler/email'
import * as config from '../config'
import { Redis } from 'ioredis'

export class QueueService {
  private static instance: QueueService
  private queues: Record<string, Queue>
  private workers: Record<string, Worker>
  private connection: Redis

  public constructor() {
    this.connection = new Redis(config.REDIS_URL)
    this.queues = {}
    this.workers = {}
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService()
    }
    return QueueService.instance
  }

  public async start(): Promise<void> {
    console.log('Starting queue service...')
    this.addQueue(config.EMAIL_QUEUE_NAME)
    this.addWorker(config.EMAIL_QUEUE_NAME, emailHandler)
    console.log('Queue service started')
  }

  public async stop(): Promise<void> {
    console.log('Stopping queue service...')
    await Promise.all(Object.values(this.workers).map(worker => worker.close()))
    await Promise.all(Object.values(this.queues).map(queue => queue.close()))
    await this.connection.disconnect()
    console.log('Queue service stopped')
  }

  private addQueue(queueName: string): void {
    this.queues[queueName] = new Queue(queueName, { connection: this.connection })
  }

  private getQueue(queueName: string): Queue {
    return this.queues[queueName]
  }

  private async addJob(queueName: string, job: any): Promise<void> {
    await this.getQueue(queueName).add(queueName, job)
  }

  private addWorker(queueName: string, handler: Processor): void {
    this.workers[queueName] = new Worker(queueName, handler, { connection: this.connection })
  }
}