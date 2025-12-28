import { Router } from 'express';
import { z } from 'zod';
import { collaborationService } from '../services/collaborationService';

const router = Router();

const inviteSchema = z.object({
  campaignId: z.string().uuid(),
  creatorId: z.string().uuid(),
  rateInCents: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  notes: z.string().max(1000).optional(),
  deliverables: z.record(z.string(), z.any()).optional(),
});

const listQuerySchema = z.object({
  campaignId: z.string().uuid().optional(),
  creatorId: z.string().uuid().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const payload = inviteSchema.parse(req.body);
    const collaboration = await collaborationService.inviteCreator(payload);
    res.status(201).json(collaboration);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const filters = listQuerySchema.parse(req.query);
    const collaborations = await collaborationService.listCollaborations(filters);
    res.json(collaborations);
  } catch (error) {
    next(error);
  }
});

export const collaborationRouter = router;
