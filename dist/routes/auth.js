"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const session_1 = require("../lib/session");
const user_1 = require("../models/user");
const instagramService_1 = require("../services/instagramService");
const sessionService_1 = require("../services/sessionService");
const userService_1 = require("../services/userService");
const router = (0, express_1.Router)();
router.post('/login', async (req, res, next) => {
    try {
        const payload = user_1.emailSignInSchema.parse(req.body);
        const user = await userService_1.userService.authenticateWithEmail(payload.email, payload.password);
        if (!user) {
            console.log("Authentication failed for email:", payload.email);
        }
        console.log("Authenticated user:", user);
        const sessionToken = await sessionService_1.sessionService.createSession(user.id);
        console.log("Created session token:", sessionToken);
        (0, session_1.setSessionCookie)(res, sessionToken);
        return res.json({ user });
    }
    catch (error) {
        return next(error);
    }
});
router.post('/instagram', async (req, res, next) => {
    try {
        const token = (0, session_1.getSessionToken)(req);
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const userId = await sessionService_1.sessionService.getSessionUserId(token);
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const payload = user_1.instagramAuthSchema.parse(req.body);
        const accessToken = await instagramService_1.instagramService.exchangeCodeForToken(payload.code);
        const profile = await instagramService_1.instagramService.getProfile(accessToken);
        await userService_1.userService.connectInstagram(userId, accessToken, profile.handle, profile.profilePictureUrl);
        return res.json({ ok: true, profile });
    }
    catch (error) {
        return next(error);
    }
});
router.get('/me', async (req, res, next) => {
    try {
        const token = (0, session_1.getSessionToken)(req);
        if (!token) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const userId = await sessionService_1.sessionService.getSessionUserId(token);
        if (!userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        const user = await userService_1.userService.getUserById(userId);
        if (!user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        console.log("Fetched user for /me:", user);
        return res.json({ user });
    }
    catch (error) {
        return next(error);
    }
});
exports.authRouter = router;
//# sourceMappingURL=auth.js.map