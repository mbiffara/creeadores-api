import { Router } from 'express';
import { authRouter } from './auth';
import { brandRouter } from './brands';
import { campaignRouter } from './campaigns';
import { collaborationRouter } from './collaborations';
import { creatorRouter } from './creators';
import { companyRouter } from './companies';
import { userRouter } from './users';
import { webhookRouter } from './webhooks';

const router = Router();

router.use('/brands', brandRouter);
router.use('/creators', creatorRouter);
router.use('/campaigns', campaignRouter);
router.use('/collaborations', collaborationRouter);
router.use('/companies', companyRouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/webhooks', webhookRouter);

export { router };
