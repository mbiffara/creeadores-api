import https from 'node:https';
import { randomBytes } from 'node:crypto';
import { URL } from 'node:url';
import { prisma } from '../db/client';
import { HttpError } from '../lib/httpError';
import { hashPassword, verifyPassword } from '../lib/password';

export type EmailSignUpInput = {
  email: string;
  password: string;
};

export type GoogleSignUpInput = {
  token: string;
};

const userSelect = {
  id: true,
  email: true,
  name: true,
  username: true,
  signUpMethod: true,
  phoneNumber: true,
  country: true,
  instagramHandle: true,
  instagramProfilePictureUrl: true,
  instagramConnectedAt: true,
  tiktokHandle: true,
  youtubeHandle: true,
  verifiedAt: true,
  createdAt: true,
  updatedAt: true,
};

const userWithInstagramSelect = {
  ...userSelect,
  instagramAccessToken: true,
};

const normalizeUsernameBase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);

const generateUniqueUsername = async (name: string, email: string) => {
  const localPart = email.split('@')[0] ?? '';
  const base = normalizeUsernameBase(name) || normalizeUsernameBase(localPart) || 'user';

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const suffix = attempt === 0 ? '' : randomBytes(2).toString('hex');
    const candidate = `${base}${suffix}`;
    const existing = await prisma.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }
  }

  throw new HttpError(409, 'Unable to generate unique username');
};

const ensureEmailAvailable = async (email: string) => {
  const existing = await prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, 'Email already registered');
  }
};

type GoogleTokenInfo = {
  email?: string;
  name?: string;
  email_verified?: string;
  error?: string;
  error_description?: string;
};

const fetchGoogleTokenInfo = (token: string) =>
  new Promise<GoogleTokenInfo>((resolve, reject) => {
    const url = new URL('https://oauth2.googleapis.com/tokeninfo');
    url.searchParams.set('id_token', token);

    https
      .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const payload = JSON.parse(data) as GoogleTokenInfo;
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });

const getGoogleProfile = async (token: string) => {
  let info: GoogleTokenInfo;

  try {
    info = await fetchGoogleTokenInfo(token);
  } catch (error) {
    throw new HttpError(502, 'Unable to verify Google token');
  }
  if (info.error || info.error_description) {
    throw new HttpError(401, info.error_description ?? 'Invalid Google token');
  }

  if (!info.email) {
    throw new HttpError(401, 'Google token missing email');
  }

  if (info.email_verified && info.email_verified !== 'true') {
    throw new HttpError(401, 'Google email not verified');
  }

  const email = info.email.toLowerCase();
  const name = info.name?.trim() || email.split('@')[0] || 'Google User';

  return { email, name };
};

const deriveNameFromEmail = (email: string) => {
  const localPart = email.split('@')[0] ?? '';
  const cleaned = localPart.replace(/[._-]+/g, ' ').trim();
  return cleaned || 'User';
};

export const userService = {
  async registerWithEmail(input: EmailSignUpInput) {
    const email = input.email.trim().toLowerCase();
    const name = deriveNameFromEmail(email);
    await ensureEmailAvailable(email);
    const username = await generateUniqueUsername(name, email);
    const passwordHash = hashPassword(input.password);

    return prisma.user.create({
      data: {
        email,
        name,
        username,
        signUpMethod: 'EMAIL',
        passwordHash,
      },
      select: userSelect,
    });
  },

  async registerWithGoogle(input: GoogleSignUpInput) {
    const profile = await getGoogleProfile(input.token);
    const existing = await prisma.user.findFirst({
      where: { email: { equals: profile.email, mode: 'insensitive' } },
      select: { ...userSelect, signUpMethod: true },
    });

    if (existing) {
      if (existing.signUpMethod !== 'GOOGLE') {
        throw new HttpError(409, 'Email already registered');
      }

      return existing;
    }

    const username = await generateUniqueUsername(profile.name, profile.email);

    return prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        username,
        signUpMethod: 'GOOGLE',
      },
      select: userSelect,
    });
  },

  async authenticateWithEmail(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
      select: { ...userSelect, passwordHash: true, signUpMethod: true },
    });

    if (!user || !user.passwordHash || user.signUpMethod !== 'EMAIL') {
      throw new HttpError(401, 'Invalid email or password');
    }

    if (!verifyPassword(password, user.passwordHash)) {
      throw new HttpError(401, 'Invalid email or password');
    }

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  },

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userWithInstagramSelect,
    });

    if (!user) {
      return null;
    }

    const { instagramAccessToken, ...safeUser } = user;

    return {
      ...safeUser,
      instagramConnected: Boolean(instagramAccessToken && user.instagramConnectedAt),
    };
  },

  async connectInstagram(userId: string, accessToken: string, handle: string, profilePictureUrl: string | null) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        instagramAccessToken: accessToken,
        instagramConnectedAt: new Date(),
        instagramHandle: handle,
        instagramProfilePictureUrl: profilePictureUrl,
      },
    });
  },

  async listUsers() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: userSelect,
    });
  },
};
