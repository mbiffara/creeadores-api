import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

export const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${hash}`;
};

export const verifyPassword = (password: string, storedHash: string) => {
  const [method, salt, hash] = storedHash.split('$');
  if (method !== 'scrypt' || !salt || !hash) {
    return false;
  }

  const expected = Buffer.from(hash, 'hex');
  const derived = scryptSync(password, salt, expected.length);
  return timingSafeEqual(expected, derived);
};
