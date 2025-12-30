"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const env_1 = require("./config/env");
const health_1 = require("./routes/health");
const routes_1 = require("./routes");
const errorHandler_1 = require("./middlewares/errorHandler");
const createApp = () => {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.set('trust proxy', env_1.env.NODE_ENV === 'production');
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use('/health', health_1.healthRouter);
    app.use(routes_1.router);
    app.use(errorHandler_1.errorHandler);
    return app;
};
exports.createApp = createApp;
exports.app = (0, exports.createApp)();
//# sourceMappingURL=app.js.map