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
    console.log('Connecting to Redis...')
    if (!config.REDIS_URL) {
      console.error('REDIS_URL not set')
      process.exit(1)
    }
    this.connection = new Redis(config.REDIS_URL)
    this.connection.on('error', async (error) => {
      console.error('Redis connection error', error)
      process.exit(1)
    })
    this.connection.on('connect', async () => {
      console.log('Connected to Redis')
    })
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
    try {
      console.log('Starting queue service...')
      this.addQueue(config.EMAIL_QUEUE_NAME)
      this.addWorker(config.EMAIL_QUEUE_NAME, emailHandler)
      console.log('Queue service started')
    } catch (error) {
      console.error('Error starting queue service')
      process.exit(0)
    }
  }

  public async stop(): Promise<void> {
    console.log('Stopping queue service...')
    try {
      if (Object.keys(this.workers).length === 0) {
        console.log('Queue service not started')
        return
      }
      await Promise.all(Object.values(this.queues).map(queue => queue.close()))

      if (Object.keys(this.queues).length === 0) {
        console.log('Queue service not started')
        return
      }
      await Promise.all(Object.values(this.workers).map(worker => worker.close()))

      await this.connection.disconnect()
      console.log('Queue service stopped')
    } catch (error) {
      console.error('Error stopping queue service')
      process.exit(0)
    }
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