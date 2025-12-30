"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatorService = void 0;
const client_1 = require("../db/client");
exports.creatorService = {
    async createCreator(input) {
        return client_1.prisma.creator.create({
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
    async listCreators(filters = {}) {
        const where = {};
        if (filters.niche) {
            where.niches = { has: filters.niche };
        }
        if (filters.search) {
            where.OR = [
                { displayName: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        return client_1.prisma.creator.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 100,
        });
    },
};
//# sourceMappingURL=creatorService.js.map