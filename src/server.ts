import { app } from './app';
import { env } from './config/env';
import { prisma } from './db/client';
import { logger } from './lib/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`CREEADORES API listening on port ${env.PORT}`);
});

const shutdown = async (signal: NodeJS.Signals) => {
  logger.info(`Received ${signal}. Closing server.`);
  server.close(async (closeError?: Error) => {
    if (closeError) {
      logger.error('Error while closing HTTP server', { message: closeError.message });
    }

    await prisma.$disconnect();
    process.exit(0);
  });
};

['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
    void shutdown(signal as NodeJS.Signals);
  });
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', { message: error.message, stack: error.stack });
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection', { reason });
});
