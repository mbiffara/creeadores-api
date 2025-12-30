"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
exports.healthRouter = router;
//# sourceMappingURL=health.js.map