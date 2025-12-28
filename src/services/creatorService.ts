import type { Prisma } from '@prisma/client';
import { prisma } from '../db/client';

export type CreateCreatorInput = {
  displayName: string;
  email: string;
  instagram?: string;
  tiktok?: string;
  niches?: string[];
  languages?: string[];
  location?: string;
  bio?: string;
  rateCardMin?: number;
  rateCardMax?: number;
  timezone?: string;
};

export type CreatorFilters = {
  niche?: string;
  search?: string;
};

export const creatorService = {
  async createCreator(input: CreateCreatorInput) {
    return prisma.creator.create({
      data: {
        displayName: input.displayName,
        email: input.email,
        instagram: input.instagram,
        tiktok: input.tiktok,
        niches: input.niches ?? [],
        languages: input.languages ?? [],
        location: input.location,
        bio: input.bio,
        rateCardMin: input.rateCardMin,
        rateCardMax: input.rateCardMax,
        timezone: input.timezone ?? 'UTC',
      },
    });
  },

  async listCreators(filters: CreatorFilters = {}) {
    const where: Prisma.CreatorWhereInput = {};

    if (filters.niche) {
      where.niches = { has: filters.niche };
    }

    if (filters.search) {
      where.OR = [
        { displayName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return prisma.creator.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  },
};
