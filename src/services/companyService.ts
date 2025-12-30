import { prisma } from '../db/client';
import { HttpError } from '../lib/httpError';
import { hashPassword } from '../lib/password';

export type CreateCompanyInput = {
  companyName: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
};

const companySelect = {
  id: true,
  name: true,
  ownerId: true,
  createdAt: true,
  updatedAt: true,
};

const companyUserSelect = {
  id: true,
  companyId: true,
  name: true,
  email: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

const ensureCompanyUserEmailAvailable = async (email: string) => {
  const existing = await prisma.companyUser.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
    select: { id: true },
  });

  if (existing) {
    throw new HttpError(409, 'Email already registered');
  }
};

export const companyService = {
  async createCompanyWithOwner(input: CreateCompanyInput) {
    const email = input.email.trim().toLowerCase();
    await ensureCompanyUserEmailAvailable(email);
    const passwordHash = hashPassword(input.password);

    return prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: input.companyName,
        },
        select: companySelect,
      });

      const owner = await tx.companyUser.create({
        data: {
          companyId: company.id,
          name: input.name,
          email,
          phone: input.phone ?? null,
          passwordHash,
        },
        select: companyUserSelect,
      });

      const updatedCompany = await tx.company.update({
        where: { id: company.id },
        data: { ownerId: owner.id },
        select: companySelect,
      });

      return { company: updatedCompany, owner };
    });
  },
};
