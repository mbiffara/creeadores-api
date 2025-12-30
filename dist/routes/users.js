"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const session_1 = require("../lib/session");
const userService_1 = require("../services/userService");
const sessionService_1 = require("../services/sessionService");
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
router.post('/', async (req, res, next) => {
    try {
        const payload = user_1.emailSignUpSchema.parse(req.body);
        const user = await userService_1.userService.registerWithEmail(payload);
        const sessionToken = await sessionService_1.sessionService.createSession(user.id);
        (0, session_1.setSessionCookie)(res, sessionToken);
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
router.post('/google', async (req, res, next) => {
    try {
        const payload = user_1.googleSignUpSchema.parse(req.body);
        const user = await userService_1.userService.registerWithGoogle(payload);
        const sessionToken = await sessionService_1.sessionService.createSession(user.id);
        (0, session_1.setSessionCookie)(res, sessionToken);
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
router.get('/', async (_req, res, next) => {
    try {
        const users = await userService_1.userService.listUsers();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
});
exports.userRouter = router;
//# sourceMappingURL=users.js.map