"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creatorRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const creatorService_1 = require("../services/creatorService");
const router = (0, express_1.Router)();
const createCreatorSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(1),
    email: zod_1.z.string().email(),
    instagram: zod_1.z.string().optional(),
    tiktok: zod_1.z.string().optional(),
    niches: zod_1.z.array(zod_1.z.string()).default([]),
    languages: zod_1.z.array(zod_1.z.string()).default([]),
    location: zod_1.z.string().optional(),
    bio: zod_1.z.string().max(1000).optional(),
    rateCardMin: zod_1.z.number().int().nonnegative().optional(),
    rateCardMax: zod_1.z.number().int().nonnegative().optional(),
    timezone: zod_1.z.string().optional(),
});
const listQuerySchema = zod_1.z.object({
    niche: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
});
router.post('/', async (req, res, next) => {
    try {
        const payload = createCreatorSchema.parse(req.body);
        const creator = await creatorService_1.creatorService.createCreator(payload);
        res.status(201).json(creator);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (req, res, next) => {
    try {
        const filters = listQuerySchema.parse(req.query);
        const creators = await creatorService_1.creatorService.listCreators(filters);
        res.json(creators);
    }
    catch (error) {
        next(error);
    }
});
exports.creatorRouter = router;
//# sourceMappingURL=creators.js.map