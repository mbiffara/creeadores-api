"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandService = void 0;
const client_1 = require("../db/client");
exports.brandService = {
    async createBrand(input) {
        return client_1.prisma.brand.create({
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
        return client_1.prisma.brand.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    },
};
//# sourceMappingURL=brandService.js.map