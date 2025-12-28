import { Router } from 'express';
import { z } from 'zod';
import { creatorService } from '../services/creatorService';

const router = Router();

const createCreatorSchema = z.object({
  displayName: z.string().min(1),
  email: z.string().email(),
  instagram: z.string().optional(),
  tiktok: z.string().optional(),
  niches: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  location: z.string().optional(),
  bio: z.string().max(1000).optional(),
  rateCardMin: z.number().int().nonnegative().optional(),
  rateCardMax: z.number().int().nonnegative().optional(),
  timezone: z.string().optional(),
});

const listQuerySchema = z.object({
  niche: z.string().optional(),
  search: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createCreatorSchema.parse(req.body);
    const creator = await creatorService.createCreator(payload);
    res.status(201).json(creator);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filters = listQuerySchema.parse(req.query);
    const creators = await creatorService.listCreators(filters);
    res.json(creators);
  } catch (error) {
    next(error);
  }
});

export const creatorRouter = router;
