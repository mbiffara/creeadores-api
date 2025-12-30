"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyCreateSchema = void 0;
const zod_1 = require("zod");
const phoneSchema = zod_1.z.preprocess((value) => (typeof value === 'string' && value.trim() === '' ? undefined : value), zod_1.z.string().trim().min(1).optional());
exports.companyCreateSchema = zod_1.z.object({
    companyName: zod_1.z.string().trim().min(1),
    name: zod_1.z.string().trim().min(1),
    email: zod_1.z.string().trim().email().transform((value) => value.toLowerCase()),
    phone: phoneSchema,
    password: zod_1.z.string().min(8),
});
//# sourceMappingURL=company.js.map