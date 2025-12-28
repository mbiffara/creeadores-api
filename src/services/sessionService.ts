import { randomBytes } from 'node:crypto';
import Redis from 'ioredis';
import { env } from '../config/env';
import { SESSION_TTL_SECONDS } from '../config/session';
import { HttpError } from '../lib/httpError';

type SessionRecord = {
  userId: string;
  createdAt: string;
};

const redis = new Redis(env.REDIS_URL);

const sessionKey = (token: string) => `session:${token}`;

const parseSession = (raw: string | null) => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionRecord;
  } catch {
    return null;
  }
};

export const sessionService = {
  async createSession(userId: string) {
    const token = randomBytes(32).toString('hex');
    const payload: SessionRecord = {
      userId,
      createdAt: new Date().toISOString(),
    };

    try {
      await redis.set(sessionKey(token), JSON.stringify(payload), 'EX', SESSION_TTL_SECONDS);
    } catch {
      throw new HttpError(503, 'Unable to start session');
    }

    return token;
  },

  async getSessionUserId(token: string) {
    try {
      const raw = await redis.get(sessionKey(token));
      const session = parseSession(raw);
      return session?.userId ?? null;
    } catch {
      throw new HttpError(503, 'Unable to validate session');
    }
  },
};
