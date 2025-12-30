"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    DATABASE_URL: zod_1.z.string().min(1, 'DATABASE_URL is required'),
    REDIS_URL: zod_1.z.string().default('redis://localhost:6379/0'),
    BULLMQ_QUEUE_NAME: zod_1.z.string().default('ugc_notifications'),
    BULLMQ_JOB_NAME: zod_1.z.string().default('creator-invite'),
    LOG_LEVEL: zod_1.z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    INSTAGRAM_CLIENT_ID: zod_1.z.string().min(1).optional(),
    INSTAGRAM_CLIENT_SECRET: zod_1.z.string().min(1).optional(),
    INSTAGRAM_REDIRECT_URI: zod_1.z.string().url().optional(),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error(process.env);
    console.error('Invalid environment variables', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration. Fix .env values and restart the server.');
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map