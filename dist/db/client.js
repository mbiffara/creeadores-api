"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const env_1 = require("../config/env");
const prismaLogLevels = env_1.env.NODE_ENV === 'development'
    ? ['query', 'warn', 'error']
    : ['warn', 'error'];
exports.prisma = new client_1.PrismaClient({
    log: prismaLogLevels,
});
process.on('beforeExit', async () => {
    await exports.prisma.$disconnect();
});
//# sourceMappingURL=client.js.map