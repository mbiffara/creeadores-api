import { randomUUID } from 'node:crypto';
import Redis from 'ioredis';
import { env } from '../config/env';
import { logger } from '../lib/logger';

export type SidekiqJobOptions = {
  queue?: string;
  worker: string;
  args?: unknown[];
  retry?: boolean;
};

export class SidekiqClient {
  private readonly redis: Redis;

  constructor(redisUrl: string) {
    this.redis = new Redis(redisUrl);
  }

  async enqueue(options: SidekiqJobOptions) {
    const queue = options.queue ?? env.SIDEKIQ_DEFAULT_QUEUE;
    const jid = randomUUID();
    const timestamp = Date.now() / 1000;
    const payload = {
      class: options.worker,
      queue,
      args: options.args ?? [],
      retry: options.retry ?? true,
      jid,
      created_at: timestamp,
      enqueued_at: timestamp,
    };

    try {
      await this.redis.lpush(`queue:${queue}`, JSON.stringify(payload));
      logger.debug('Enqueued Sidekiq job', { queue, worker: options.worker, jid });
      return jid;
    } catch (error) {
      logger.error('Failed to enqueue Sidekiq job', error instanceof Error ? { message: error.message } : undefined);
      return undefined;
    }
  }

  async close() {
    await this.redis.quit();
  }
}

export const sidekiqClient = new SidekiqClient(env.REDIS_URL);
