"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const zod_1 = require("zod");
const campaignService_1 = require("../services/campaignService");
const router = (0, express_1.Router)();
const createCampaignSchema = zod_1.z.object({
    brandId: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1),
    summary: zod_1.z.string().min(1),
    deliverableTypes: zod_1.z.array(zod_1.z.string()).nonempty(),
    budgetMin: zod_1.z.number().int().nonnegative(),
    budgetMax: zod_1.z.number().int().nonnegative(),
    currency: zod_1.z.string().length(3).optional(),
    dueDate: zod_1.z.string().optional(),
    creativeNotes: zod_1.z.string().optional(),
    heroAssetUrl: zod_1.z.string().url().optional(),
});
const listQuerySchema = zod_1.z.object({
    brandId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.nativeEnum(client_1.CampaignStatus).optional(),
});
router.post('/', async (req, res, next) => {
    try {
        const payload = createCampaignSchema.parse(req.body);
        const campaign = await campaignService_1.campaignService.createCampaign(payload);
        res.status(201).json(campaign);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const filters = listQuerySchema.parse(req.query);
        const campaigns = await campaignService_1.campaignService.listCampaigns(filters);
        res.json(campaigns);
    }
    catch (error) {
        next(error);
    }
});
exports.campaignRouter = router;
//# sourceMappingURL=campaigns.js.map