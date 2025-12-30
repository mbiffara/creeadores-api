"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaborationService = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const client_2 = require("../db/client");
const httpError_1 = require("../lib/httpError");
const logger_1 = require("../lib/logger");
const bullmqClient_1 = require("../queue/bullmqClient");
const collaborationInclude = {
    campaign: { select: { id: true, title: true, brand: { select: { id: true, name: true } } } },
    creator: { select: { id: true, displayName: true, email: true } },
};
exports.collaborationService = {
    async inviteCreator(input) {
        const [campaign, creator, existing] = await Promise.all([
            client_2.prisma.campaign.findUnique({
                where: { id: input.campaignId },
                include: { brand: true },
            }),
            client_2.prisma.creator.findUnique({ where: { id: input.creatorId } }),
            client_2.prisma.collaboration.findUnique({
                where: {
                    campaignId_creatorId: {
                        campaignId: input.campaignId,
                        creatorId: input.creatorId,
                    },
                },
            }),
        ]);
        if (!campaign) {
            throw new httpError_1.HttpError(404, 'Campaign not found');
        }
        if (!creator) {
            throw new httpError_1.HttpError(404, 'Creator not found');
        }
        if (existing) {
            throw new httpError_1.HttpError(409, 'Creator already invited to this campaign');
        }
        const collaboration = (await client_2.prisma.collaboration.create({
            data: {
                campaignId: input.campaignId,
                creatorId: input.creatorId,
                status: client_1.CollaborationStatus.INVITED,
                rateInCents: input.rateInCents,
                currency: input.currency ?? campaign.currency,
                notes: input.notes,
                deliverables: input.deliverables,
            },
            include: collaborationInclude,
        }));
        const jobId = await bullmqClient_1.bullmqClient.enqueue({
            name: env_1.env.BULLMQ_JOB_NAME,
            data: {
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
        });
        if (jobId) {
            await client_2.prisma.collaboration.update({
                where: { id: collaboration.id },
                data: { queueJobId: jobId },
            });
        }
        else {
            logger_1.logger.warn('BullMQ job was not enqueued', { collaborationId: collaboration.id });
        }
        return collaboration;
    },
    async listCollaborations(filters = {}) {
        const where = {};
        if (filters.campaignId) {
            where.campaignId = filters.campaignId;
        }
        if (filters.creatorId) {
            where.creatorId = filters.creatorId;
        }
        return client_2.prisma.collaboration.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                campaign: { select: { id: true, title: true } },
                creator: { select: { id: true, displayName: true } },
            },
        });
    },
};
//# sourceMappingURL=collaborationService.js.map