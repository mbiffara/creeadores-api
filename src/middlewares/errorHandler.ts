import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/httpError';
import { logger } from '../lib/logger';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
    logger.warn('Validation error', { details });
    return res.status(400).json({ error: 'Validation failed', details });
  }

  if (err instanceof HttpError) {
    logger.warn('Handled HttpError', { statusCode: err.statusCode, message: err.message });
    return res.status(err.statusCode).json({ error: err.message });
  }

  logger.error('Unexpected error', err instanceof Error ? { message: err.message, stack: err.stack } : undefined);
  return res.status(500).json({ error: 'Internal server error' });
}
