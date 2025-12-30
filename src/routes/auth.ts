import { Router } from 'express';
import { getSessionToken, setSessionCookie } from '../lib/session';
import { emailSignInSchema, instagramAuthSchema } from '../models/user';
import { instagramService } from '../services/instagramService';
import { sessionService } from '../services/sessionService';
import { userService } from '../services/userService';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const payload = emailSignInSchema.parse(req.body);
    const user = await userService.authenticateWithEmail(payload.email, payload.password);
    if (!user) {
      console.log("Authentication failed for email:", payload.email);
    }

    console.log("Authenticated user:", user);

    const sessionToken = await sessionService.createSession(user.id);
    console.log("Created session token:", sessionToken);
    setSessionCookie(res, sessionToken);
    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

router.post('/instagram', async (req, res, next) => {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = await sessionService.getSessionUserId(token);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = instagramAuthSchema.parse(req.body);
    const accessToken = await instagramService.exchangeCodeForToken(payload.code);
    const profile = await instagramService.getProfile(accessToken);
    await userService.connectInstagram(userId, accessToken, profile.handle, profile.profilePictureUrl);

    return res.json({ ok: true, profile });
  } catch (error) {
    return next(error);
  }
});

router.get('/me', async (req, res, next) => {
  try {
    const token = getSessionToken(req);
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const userId = await sessionService.getSessionUserId(token);
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});

export const authRouter = router;
