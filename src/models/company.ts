import { z } from 'zod';

const phoneSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().trim().min(1).optional()
);

export const companyCreateSchema = z.object({
  companyName: z.string().trim().min(1),
  name: z.string().trim().min(1),
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  phone: phoneSchema,
  password: z.string().min(8),
});

export type CompanyCreatePayload = z.infer<typeof companyCreateSchema>;
