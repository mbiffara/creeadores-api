import { Router } from 'express';
import { z } from 'zod';
import { brandService } from '../services/brandService';

const router = Router();

const createBrandSchema = z.object({
  name: z.string().min(1),
  contactEmail: z.string().email(),
  contactName: z.string().optional(),
  website: z.string().url().optional(),
  industries: z.array(z.string()).default([]),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createBrandSchema.parse(req.body);
    const brand = await brandService.createBrand(payload);
    res.status(201).json(brand);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const brands = await brandService.listBrands();
    res.json(brands);
  } catch (error) {
    next(error);
  }
});

export const brandRouter = router;
