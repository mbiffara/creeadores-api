"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const client_1 = require("./db/client");
const logger_1 = require("./lib/logger");
const server = app_1.app.listen(env_1.env.PORT, () => {
    logger_1.logger.info(`CREEADORES API listening on port ${env_1.env.PORT}`);
});
const shutdown = async (signal) => {
    logger_1.logger.info(`Received ${signal}. Closing server.`);
    server.close(async (closeError) => {
        if (closeError) {
            logger_1.logger.error('Error while closing HTTP server', { message: closeError.message });
        }
        await client_1.prisma.$disconnect();
        process.exit(0);
    });
};
['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, () => {
        void shutdown(signal);
    });
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught exception', { message: error.message, stack: error.stack });
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled rejection', { reason });
});
//# sourceMappingURL=server.js.map