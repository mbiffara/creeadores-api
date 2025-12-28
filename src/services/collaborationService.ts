import type { Prisma } from '@prisma/client';
import { CollaborationStatus } from '@prisma/client';
import { env } from '../config/env';
import { prisma } from '../db/client';
import { HttpError } from '../lib/httpError';
import { logger } from '../lib/logger';
import { sidekiqClient } from '../queue/sidekiqClient';

const collaborationInclude = {
  campaign: { select: { id: true, title: true, brand: { select: { id: true, name: true } } } },
  creator: { select: { id: true, displayName: true, email: true } },
} satisfies Prisma.CollaborationInclude;

type CollaborationWithRelations = Prisma.CollaborationGetPayload<{
  include: typeof collaborationInclude;
}>;

export type InviteCreatorInput = {
  campaignId: string;
  creatorId: string;
  rateInCents?: number;
  currency?: string;
  notes?: string;
  deliverables?: Prisma.InputJsonValue;
};

export const collaborationService = {
  async inviteCreator(input: InviteCreatorInput) {
    const [campaign, creator, existing] = await Promise.all([
      prisma.campaign.findUnique({
        where: { id: input.campaignId },
        include: { brand: true },
      }),
      prisma.creator.findUnique({ where: { id: input.creatorId } }),
      prisma.collaboration.findUnique({
        where: {
          campaignId_creatorId: {
            campaignId: input.campaignId,
            creatorId: input.creatorId,
          },
        },
      }),
    ]);

    if (!campaign) {
      throw new HttpError(404, 'Campaign not found');
    }

    if (!creator) {
      throw new HttpError(404, 'Creator not found');
    }

    if (existing) {
      throw new HttpError(409, 'Creator already invited to this campaign');
    }

    const collaboration = (await prisma.collaboration.create({
      data: {
        campaignId: input.campaignId,
        creatorId: input.creatorId,
        status: CollaborationStatus.INVITED,
        rateInCents: input.rateInCents,
        currency: input.currency ?? campaign.currency,
        notes: input.notes,
        deliverables: input.deliverables,
      },
      include: collaborationInclude,
    })) as CollaborationWithRelations;

    const jobId = await sidekiqClient.enqueue({
      worker: env.SIDEKIQ_NOTIFICATION_WORKER,
      args: [
        {
          collaborationId: collaboration.id,
          campaignId: collaboration.campaignId,
          campaignTitle: collaboration.campaign.title,
          brandId: campaign.brandId,
          brandName: campaign.brand.name,
          creatorId: collaboration.creatorId,
          creatorName: collaboration.creator.displayName,
          creatorEmail: collaboration.creator.email,
          rateInCents: collaboration.rateInCents,
          currency: collaboration.currency,
        },
      ],
    });

    if (jobId) {
      await prisma.collaboration.update({
        where: { id: collaboration.id },
        data: { sidekiqJobId: jobId },
      });
    } else {
      logger.warn('Sidekiq job was not enqueued', { collaborationId: collaboration.id });
    }

    return collaboration;
  },

  async listCollaborations(filters: { campaignId?: string; creatorId?: string } = {}) {
    const where: Prisma.CollaborationWhereInput = {};

    if (filters.campaignId) {
      where.campaignId = filters.campaignId;
    }

    if (filters.creatorId) {
      where.creatorId = filters.creatorId;
    }

    return prisma.collaboration.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        campaign: { select: { id: true, title: true } },
        creator: { select: { id: true, displayName: true } },
      },
    });
  },
};
