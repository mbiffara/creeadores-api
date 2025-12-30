"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramAuthSchema = exports.emailSignInSchema = exports.googleSignUpSchema = exports.emailSignUpSchema = void 0;
const zod_1 = require("zod");
exports.emailSignUpSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().transform((value) => value.toLowerCase()),
    password: zod_1.z.string().min(8),
});
exports.googleSignUpSchema = zod_1.z.object({
    token: zod_1.z.string().min(1),
});
exports.emailSignInSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email().transform((value) => value.toLowerCase()),
    password: zod_1.z.string().min(8),
});
exports.instagramAuthSchema = zod_1.z.object({
    code: zod_1.z.string().min(1),
});
//# sourceMappingURL=user.js.map