"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookRouter = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/meta', (req, res) => {
    console.log(req.query);
    const challenge = req.query['hub.challenge'];
    res.type('text/plain').send(typeof challenge === 'string' ? challenge : '');
});
router.post('/meta', (req, res) => {
    console.log(req.query);
    res.json({
        received: {
            query: req.query,
            body: req.body,
        },
    });
});
exports.webhookRouter = router;
//# sourceMappingURL=webhooks.js.map