"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignService = void 0;
const client_1 = require("../db/client");
const httpError_1 = require("../lib/httpError");
exports.campaignService = {
    async createCampaign(input) {
        const brand = await client_1.prisma.brand.findUnique({ where: { id: input.brandId } });
        if (!brand) {
            throw new httpError_1.HttpError(404, 'Brand not found');
        }
        return client_1.prisma.campaign.create({
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
    async listCampaigns(filters = {}) {
        const where = {};
        if (filters.brandId) {
            where.brandId = filters.brandId;
        }
        if (filters.status) {
            where.status = filters.status;
        }
        return client_1.prisma.campaign.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                brand: { select: { id: true, name: true } },
            },
        });
    },
};
//# sourceMappingURL=campaignService.js.map