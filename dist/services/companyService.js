"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyService = void 0;
const client_1 = require("../db/client");
const httpError_1 = require("../lib/httpError");
const password_1 = require("../lib/password");
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
const ensureCompanyUserEmailAvailable = async (email) => {
    const existing = await client_1.prisma.companyUser.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        select: { id: true },
    });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Email already registered');
    }
};
exports.companyService = {
    async createCompanyWithOwner(input) {
        const email = input.email.trim().toLowerCase();
        await ensureCompanyUserEmailAvailable(email);
        const passwordHash = (0, password_1.hashPassword)(input.password);
        return client_1.prisma.$transaction(async (tx) => {
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
//# sourceMappingURL=companyService.js.map