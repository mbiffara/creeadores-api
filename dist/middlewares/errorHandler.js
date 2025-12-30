"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const httpError_1 = require("../lib/httpError");
const logger_1 = require("../lib/logger");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        const details = err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message }));
        logger_1.logger.warn('Validation error', { details });
        return res.status(400).json({ error: 'Validation failed', details });
    }
    if (err instanceof httpError_1.HttpError) {
        logger_1.logger.warn('Handled HttpError', { statusCode: err.statusCode, message: err.message });
        return res.status(err.statusCode).json({ error: err.message });
    }
    logger_1.logger.error('Unexpected error', err instanceof Error ? { message: err.message, stack: err.stack } : undefined);
    return res.status(500).json({ error: 'Internal server error' });
}
//# sourceMappingURL=errorHandler.js.map