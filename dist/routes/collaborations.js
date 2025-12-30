"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collaborationRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const collaborationService_1 = require("../services/collaborationService");
const router = (0, express_1.Router)();
const inviteSchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid(),
    creatorId: zod_1.z.string().uuid(),
    rateInCents: zod_1.z.number().int().positive().optional(),
    currency: zod_1.z.string().length(3).optional(),
    notes: zod_1.z.string().max(1000).optional(),
    deliverables: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
});
const listQuerySchema = zod_1.z.object({
    campaignId: zod_1.z.string().uuid().optional(),
    creatorId: zod_1.z.string().uuid().optional(),
});
router.post('/', async (req, res, next) => {
    try {
        const payload = inviteSchema.parse(req.body);
        const collaboration = await collaborationService_1.collaborationService.inviteCreator(payload);
        res.status(201).json(collaboration);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const filters = listQuerySchema.parse(req.query);
        const collaborations = await collaborationService_1.collaborationService.listCollaborations(filters);
        res.json(collaborations);
    }
    catch (error) {
        next(error);
    }
});
exports.collaborationRouter = router;
//# sourceMappingURL=collaborations.js.map