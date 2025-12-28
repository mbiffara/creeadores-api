import type { Request, Response } from 'express';
import { env } from '../config/env';
import { SESSION_COOKIE_NAME, SESSION_HEADER_NAME, SESSION_TTL_SECONDS } from '../config/session';

const parseCookies = (header?: string) => {
  const cookies: Record<string, string> = {};

  if (!header) {
    return cookies;
  }

  for (const part of header.split(';')) {
    const [name, ...valueParts] = part.trim().split('=');
    if (!name) {
      continue;
    }

    const value = valueParts.join('=');
    if (!value) {
      continue;
    }

    try {
      cookies[name] = decodeURIComponent(value);
    } catch {
      cookies[name] = value;
    }
  }

  return cookies;
};

export const getSessionToken = (req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }

  const cookies = parseCookies(req.headers.cookie);
  return cookies[SESSION_COOKIE_NAME];
};

export const setSessionCookie = (res: Response, token: string) => {
  res.cookie(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: SESSION_TTL_SECONDS * 1000,
    path: '/',
  });
  res.setHeader(SESSION_HEADER_NAME, token);
};
