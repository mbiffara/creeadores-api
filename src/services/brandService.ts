import { prisma } from '../db/client';

export type CreateBrandInput = {
  name: string;
  contactEmail: string;
  contactName?: string;
  website?: string;
  industries?: string[];
};

export const brandService = {
  async createBrand(input: CreateBrandInput) {
    return prisma.brand.create({
      data: {
        name: input.name,
        contactEmail: input.contactEmail,
        contactName: input.contactName,
        website: input.website,
        industries: input.industries ?? [],
      },
    });
  },

  async listBrands() {
    return prisma.brand.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },
};
