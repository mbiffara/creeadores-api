"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionService = void 0;
const node_crypto_1 = require("node:crypto");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("../config/env");
const session_1 = require("../config/session");
const httpError_1 = require("../lib/httpError");
const redis = new ioredis_1.default(env_1.env.REDIS_URL);
const sessionKey = (token) => `session:${token}`;
const parseSession = (raw) => {
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
exports.sessionService = {
    async createSession(userId) {
        const token = (0, node_crypto_1.randomBytes)(32).toString('hex');
        const payload = {
            userId,
            createdAt: new Date().toISOString(),
        };
        try {
            await redis.set(sessionKey(token), JSON.stringify(payload), 'EX', session_1.SESSION_TTL_SECONDS);
        }
        catch {
            throw new httpError_1.HttpError(503, 'Unable to start session');
        }
        return token;
    },
    async getSessionUserId(token) {
        try {
            const raw = await redis.get(sessionKey(token));
            const session = parseSession(raw);
            return session?.userId ?? null;
        }
        catch {
            throw new httpError_1.HttpError(503, 'Unable to validate session');
        }
    },
};
//# sourceMappingURL=sessionService.js.map