import express from 'express';
import { env } from './config/env';
import { healthRouter } from './routes/health';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';

export const createApp = () => {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', env.NODE_ENV === 'production');
  app.use(express.json({ limit: '1mb' }));

  app.use('/health', healthRouter);

  app.use(router);
  app.use(errorHandler);

  return app;
};

export const app = createApp();
