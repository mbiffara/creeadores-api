import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().default('redis://localhost:6379/0'),
  SIDEKIQ_DEFAULT_QUEUE: z.string().default('ugc_notifications'),
  SIDEKIQ_NOTIFICATION_WORKER: z.string().default('Notifications::CreatorInviteWorker'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  INSTAGRAM_CLIENT_ID: z.string().min(1).optional(),
  INSTAGRAM_CLIENT_SECRET: z.string().min(1).optional(),
  INSTAGRAM_REDIRECT_URI: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Fix .env values and restart the server.');
}

export const env = parsed.data;
