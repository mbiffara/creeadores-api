import { Router } from 'express';
import { companyCreateSchema } from '../models/company';
import { companyService } from '../services/companyService';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const payload = companyCreateSchema.parse(req.body);
    const result = await companyService.createCompanyWithOwner(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export const companyRouter = router;
