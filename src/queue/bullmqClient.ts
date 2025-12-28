import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../lib/logger';

export type BullMQJobOptions = {
  name: string;
  data: Record<string, unknown>;
};

const connection = new Redis(env.REDIS_URL);
const queue = new Queue(env.BULLMQ_QUEUE_NAME, { connection });

export const bullmqClient = {
  async enqueue(options: BullMQJobOptions) {
    try {
      const job = await queue.add(options.name, options.data);
      const jobId = job.id ? String(job.id) : undefined;
      logger.debug('Enqueued BullMQ job', { queue: env.BULLMQ_QUEUE_NAME, name: options.name, jobId });
      return jobId;
    } catch (error) {
      logger.error('Failed to enqueue BullMQ job', error instanceof Error ? { message: error.message } : undefined);
      return undefined;
    }
  },

  async close() {
    await queue.close();
    await connection.quit();
  },
};
