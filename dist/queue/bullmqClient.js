"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bullmqClient = void 0;
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const logger_1 = require("../lib/logger");
const connection = new ioredis_1.default(env_1.env.REDIS_URL);
const queue = new bullmq_1.Queue(env_1.env.BULLMQ_QUEUE_NAME, { connection });
exports.bullmqClient = {
    async enqueue(options) {
        try {
            const job = await queue.add(options.name, options.data);
            const jobId = job.id ? String(job.id) : undefined;
            logger_1.logger.debug('Enqueued BullMQ job', { queue: env_1.env.BULLMQ_QUEUE_NAME, name: options.name, jobId });
            return jobId;
        }
        catch (error) {
            logger_1.logger.error('Failed to enqueue BullMQ job', error instanceof Error ? { message: error.message } : undefined);
            return undefined;
        }
    },
    async close() {
        await queue.close();
        await connection.quit();
    },
};
//# sourceMappingURL=bullmqClient.js.map