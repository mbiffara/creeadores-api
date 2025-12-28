import { Router } from 'express';
import { setSessionCookie } from '../lib/session';
import { userService } from '../services/userService';
import { sessionService } from '../services/sessionService';
import { emailSignUpSchema, googleSignUpSchema } from '../models/user';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const payload = emailSignUpSchema.parse(req.body);
    const user = await userService.registerWithEmail(payload);
    const sessionToken = await sessionService.createSession(user.id);
    setSessionCookie(res, sessionToken);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/google', async (req, res, next) => {
  try {
    const payload = googleSignUpSchema.parse(req.body);
    const user = await userService.registerWithGoogle(payload);
    const sessionToken = await sessionService.createSession(user.id);
    setSessionCookie(res, sessionToken);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req, res, next) => {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export const userRouter = router;
