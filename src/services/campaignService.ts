import type { CampaignStatus, Prisma } from '@prisma/client';
import { prisma } from '../db/client';
import { HttpError } from '../lib/httpError';

export type CreateCampaignInput = {
  brandId: string;
  title: string;
  summary: string;
  deliverableTypes: string[];
  budgetMin: number;
  budgetMax: number;
  currency?: string;
  dueDate?: string;
  creativeNotes?: string;
  heroAssetUrl?: string;
};

export type CampaignFilters = {
  brandId?: string;
  status?: CampaignStatus;
};

export const campaignService = {
  async createCampaign(input: CreateCampaignInput) {
    const brand = await prisma.brand.findUnique({ where: { id: input.brandId } });

    if (!brand) {
      throw new HttpError(404, 'Brand not found');
    }

    return prisma.campaign.create({
      data: {
        brandId: input.brandId,
        title: input.title,
        summary: input.summary,
        deliverableTypes: input.deliverableTypes,
        budgetMin: input.budgetMin,
        budgetMax: input.budgetMax,
        currency: input.currency ?? 'USD',
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        creativeNotes: input.creativeNotes,
        heroAssetUrl: input.heroAssetUrl,
      },
    });
  },

  async listCampaigns(filters: CampaignFilters = {}) {
    const where: Prisma.CampaignWhereInput = {};

    if (filters.brandId) {
      where.brandId = filters.brandId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    return prisma.campaign.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        brand: { select: { id: true, name: true } },
      },
    });
  },
};
