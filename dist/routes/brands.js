"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const brandService_1 = require("../services/brandService");
const router = (0, express_1.Router)();
const createBrandSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    contactEmail: zod_1.z.string().email(),
    contactName: zod_1.z.string().optional(),
    website: zod_1.z.string().url().optional(),
    industries: zod_1.z.array(zod_1.z.string()).default([]),
});
router.post('/', async (req, res, next) => {
    try {
        const payload = createBrandSchema.parse(req.body);
        const brand = await brandService_1.brandService.createBrand(payload);
        res.status(201).json(brand);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (_req, res, next) => {
    try {
        const brands = await brandService_1.brandService.listBrands();
        res.json(brands);
    }
    catch (error) {
        next(error);
    }
});
exports.brandRouter = router;
//# sourceMappingURL=brands.js.map