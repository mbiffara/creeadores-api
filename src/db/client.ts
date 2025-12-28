import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';

const prismaLogLevels: ('query' | 'info' | 'warn' | 'error')[] = env.NODE_ENV === 'development'
  ? ['query', 'warn', 'error']
  : ['warn', 'error'];

export const prisma = new PrismaClient({
  log: prismaLogLevels,
});

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
