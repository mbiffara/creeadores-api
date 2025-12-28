import { CampaignStatus } from '@prisma/client';
import { Router } from 'express';
import { z } from 'zod';
import { campaignService } from '../services/campaignService';

const router = Router();

const createCampaignSchema = z.object({
  brandId: z.string().uuid(),
  title: z.string().min(1),
  summary: z.string().min(1),
  deliverableTypes: z.array(z.string()).nonempty(),
  budgetMin: z.number().int().nonnegative(),
  budgetMax: z.number().int().nonnegative(),
  currency: z.string().length(3).optional(),
  dueDate: z.string().optional(),
  creativeNotes: z.string().optional(),
  heroAssetUrl: z.string().url().optional(),
});

const listQuerySchema = z.object({
  brandId: z.string().uuid().optional(),
  status: z.nativeEnum(CampaignStatus).optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = createCampaignSchema.parse(req.body);
    const campaign = await campaignService.createCampaign(payload);
    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filters = listQuerySchema.parse(req.query);
    const campaigns = await campaignService.listCampaigns(filters);
    res.json(campaigns);
  } catch (error) {
    next(error);
  }
});

export const campaignRouter = router;
