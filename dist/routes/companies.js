"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRouter = void 0;
const express_1 = require("express");
const company_1 = require("../models/company");
const companyService_1 = require("../services/companyService");
const router = (0, express_1.Router)();
router.post('/', async (req, res, next) => {
    try {
        const payload = company_1.companyCreateSchema.parse(req.body);
        const result = await companyService_1.companyService.createCompanyWithOwner(payload);
        res.status(201).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.companyRouter = router;
//# sourceMappingURL=companies.js.map