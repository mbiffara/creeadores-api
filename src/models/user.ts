import { z } from 'zod';

export const emailSignUpSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

export const googleSignUpSchema = z.object({
  token: z.string().min(1),
});

export const emailSignInSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

export const instagramAuthSchema = z.object({
  code: z.string().min(1),
});

export type EmailSignUpPayload = z.infer<typeof emailSignUpSchema>;
export type GoogleSignUpPayload = z.infer<typeof googleSignUpSchema>;
export type EmailSignInPayload = z.infer<typeof emailSignInSchema>;
export type InstagramAuthPayload = z.infer<typeof instagramAuthSchema>;
