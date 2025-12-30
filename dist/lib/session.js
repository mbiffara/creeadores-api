"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setSessionCookie = exports.getSessionToken = void 0;
const env_1 = require("../config/env");
const session_1 = require("../config/session");
const parseCookies = (header) => {
    const cookies = {};
    if (!header) {
        return cookies;
    }
    for (const part of header.split(';')) {
        const [name, ...valueParts] = part.trim().split('=');
        if (!name) {
            continue;
        }
        const value = valueParts.join('=');
        if (!value) {
            continue;
        }
        try {
            cookies[name] = decodeURIComponent(value);
        }
        catch {
            cookies[name] = value;
        }
    }
    return cookies;
};
const getSessionToken = (req) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.toLowerCase().startsWith('bearer ')) {
        return authHeader.slice(7).trim();
    }
    const cookies = parseCookies(req.headers.cookie);
    return cookies[session_1.SESSION_COOKIE_NAME];
};
exports.getSessionToken = getSessionToken;
const setSessionCookie = (res, token) => {
    res.cookie(session_1.SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: env_1.env.NODE_ENV === 'production',
        maxAge: session_1.SESSION_TTL_SECONDS * 1000,
        path: '/',
    });
    res.setHeader(session_1.SESSION_HEADER_NAME, token);
};
exports.setSessionCookie = setSessionCookie;
//# sourceMappingURL=session.js.map