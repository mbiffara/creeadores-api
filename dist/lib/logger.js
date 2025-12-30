"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const node_util_1 = __importDefault(require("node:util"));
const env_1 = require("../config/env");
const priorities = {
    debug: 10,
    info: 20,
    warn: 30,
    error: 40,
};
class Logger {
    constructor(level) {
        this.level = level;
    }
    shouldLog(level) {
        return priorities[level] >= priorities[this.level];
    }
    format(meta) {
        if (!meta || Object.keys(meta).length === 0) {
            return '';
        }
        return node_util_1.default.inspect(meta, { depth: 5, colors: false, breakLength: Infinity });
    }
    log(level, message, meta) {
        if (!this.shouldLog(level)) {
            return;
        }
        const formatted = this.format(meta);
        const payload = formatted ? `${message} ${formatted}` : message;
        switch (level) {
            case 'debug':
                console.debug(payload);
                break;
            case 'info':
                console.info(payload);
                break;
            case 'warn':
                console.warn(payload);
                break;
            case 'error':
            default:
                console.error(payload);
                break;
        }
    }
    debug(message, meta) {
        this.log('debug', message, meta);
    }
    info(message, meta) {
        this.log('info', message, meta);
    }
    warn(message, meta) {
        this.log('warn', message, meta);
    }
    error(message, meta) {
        this.log('error', message, meta);
    }
}
exports.logger = new Logger(env_1.env.LOG_LEVEL);
//# sourceMappingURL=logger.js.map