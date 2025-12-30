"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const node_https_1 = __importDefault(require("node:https"));
const node_url_1 = require("node:url");
const client_1 = require("../db/client");
const httpError_1 = require("../lib/httpError");
const password_1 = require("../lib/password");
const userSelect = {
    id: true,
    email: true,
    name: true,
    username: true,
    signUpMethod: true,
    phoneNumber: true,
    country: true,
    instagramHandle: true,
    instagramProfilePictureUrl: true,
    instagramConnectedAt: true,
    tiktokHandle: true,
    youtubeHandle: true,
    verifiedAt: true,
    createdAt: true,
    updatedAt: true,
};
const userWithInstagramSelect = {
    ...userSelect,
    instagramAccessToken: true,
};
const normalizeUsernameBase = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 20);
const generateUniqueUsername = async (name, email) => {
    const localPart = email.split('@')[0] ?? '';
    const base = normalizeUsernameBase(name) || normalizeUsernameBase(localPart) || 'user';
    for (let attempt = 0; attempt < 6; attempt += 1) {
        const suffix = attempt === 0 ? '' : randomBytes(2).toString('hex');
        const candidate = `${base}${suffix}`;
        const existing = await client_1.prisma.user.findUnique({
            where: { username: candidate },
            select: { id: true },
        });
        if (!existing) {
            return candidate;
        }
    }
    throw new httpError_1.HttpError(409, 'Unable to generate unique username');
};
const ensureEmailAvailable = async (email) => {
    const existing = await client_1.prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        select: { id: true },
    });
    if (existing) {
        throw new httpError_1.HttpError(409, 'Email already registered');
    }
};
const fetchGoogleTokenInfo = (token) => new Promise((resolve, reject) => {
    const url = new node_url_1.URL('https://oauth2.googleapis.com/tokeninfo');
    url.searchParams.set('id_token', token);
    node_https_1.default
        .get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            try {
                const payload = JSON.parse(data);
                resolve(payload);
            }
            catch (error) {
                reject(error);
            }
        });
    })
        .on('error', reject);
});
const getGoogleProfile = async (token) => {
    let info;
    try {
        info = await fetchGoogleTokenInfo(token);
    }
    catch (error) {
        throw new httpError_1.HttpError(502, 'Unable to verify Google token');
    }
    if (info.error || info.error_description) {
        throw new httpError_1.HttpError(401, info.error_description ?? 'Invalid Google token');
    }
    if (!info.email) {
        throw new httpError_1.HttpError(401, 'Google token missing email');
    }
    if (info.email_verified && info.email_verified !== 'true') {
        throw new httpError_1.HttpError(401, 'Google email not verified');
    }
    const email = info.email.toLowerCase();
    const name = info.name?.trim() || email.split('@')[0] || 'Google User';
    return { email, name };
};
const deriveNameFromEmail = (email) => {
    const localPart = email.split('@')[0] ?? '';
    const cleaned = localPart.replace(/[._-]+/g, ' ').trim();
    return cleaned || 'User';
};
exports.userService = {
    async registerWithEmail(input) {
        const email = input.email.trim().toLowerCase();
        const name = deriveNameFromEmail(email);
        await ensureEmailAvailable(email);
        const username = await generateUniqueUsername(name, email);
        const passwordHash = (0, password_1.hashPassword)(input.password);
        return client_1.prisma.user.create({
            data: {
                email,
                name,
                username,
                signUpMethod: 'EMAIL',
                passwordHash,
            },
            select: userSelect,
        });
    },
    async registerWithGoogle(input) {
        const profile = await getGoogleProfile(input.token);
        const existing = await client_1.prisma.user.findFirst({
            where: { email: { equals: profile.email, mode: 'insensitive' } },
            select: { ...userSelect, signUpMethod: true },
        });
        if (existing) {
            if (existing.signUpMethod !== 'GOOGLE') {
                throw new httpError_1.HttpError(409, 'Email already registered');
            }
            return existing;
        }
        const username = await generateUniqueUsername(profile.name, profile.email);
        return client_1.prisma.user.create({
            data: {
                email: profile.email,
                name: profile.name,
                username,
                signUpMethod: 'GOOGLE',
            },
            select: userSelect,
        });
    },
    async authenticateWithEmail(email, password) {
        const normalizedEmail = email.trim().toLowerCase();
        const user = await client_1.prisma.user.findFirst({
            where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
            select: { ...userSelect, passwordHash: true, signUpMethod: true },
        });
        if (!user || !user.passwordHash || user.signUpMethod !== 'EMAIL') {
            throw new httpError_1.HttpError(401, 'Invalid email or password');
        }
        if (!(0, password_1.verifyPassword)(password, user.passwordHash)) {
            throw new httpError_1.HttpError(401, 'Invalid email or password');
        }
        const { passwordHash, ...safeUser } = user;
        return safeUser;
    },
    async getUserById(id) {
        const user = await client_1.prisma.user.findUnique({
            where: { id },
            select: userWithInstagramSelect,
        });
        if (!user) {
            return null;
        }
        const { instagramAccessToken, ...safeUser } = user;
        return {
            ...safeUser,
            instagramConnected: Boolean(instagramAccessToken && user.instagramConnectedAt),
        };
    },
    async connectInstagram(userId, accessToken, handle, profilePictureUrl) {
        await client_1.prisma.user.update({
            where: { id: userId },
            data: {
                instagramAccessToken: accessToken,
                instagramConnectedAt: new Date(),
                instagramHandle: handle,
                instagramProfilePictureUrl: profilePictureUrl,
            },
        });
    },
    async listUsers() {
        return client_1.prisma.user.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
            select: userSelect,
        });
    },
};
//# sourceMappingURL=userService.js.map