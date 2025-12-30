"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagramService = void 0;
const node_https_1 = __importDefault(require("node:https"));
const node_url_1 = require("node:url");
const env_1 = require("../config/env");
const httpError_1 = require("../lib/httpError");
const requestInstagramToken = (body) => new Promise((resolve, reject) => {
    const request = node_https_1.default.request('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body).toString(),
        },
    }, (res) => {
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
    });
    request.on('error', reject);
    request.write(body);
    request.end();
});
const requestInstagramProfile = (accessToken) => new Promise((resolve, reject) => {
    const params = new node_url_1.URLSearchParams({
        fields: 'id,username,profile_picture_url',
        access_token: accessToken,
    });
    node_https_1.default
        .get(`https://graph.instagram.com/me?${params.toString()}`, (res) => {
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
exports.instagramService = {
    async exchangeCodeForToken(code) {
        if (!env_1.env.INSTAGRAM_CLIENT_ID || !env_1.env.INSTAGRAM_CLIENT_SECRET || !env_1.env.INSTAGRAM_REDIRECT_URI) {
            throw new httpError_1.HttpError(500, 'Instagram OAuth is not configured');
        }
        const body = new node_url_1.URLSearchParams({
            client_id: env_1.env.INSTAGRAM_CLIENT_ID,
            client_secret: env_1.env.INSTAGRAM_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: env_1.env.INSTAGRAM_REDIRECT_URI,
            code,
        }).toString();
        let response;
        try {
            response = await requestInstagramToken(body);
        }
        catch {
            throw new httpError_1.HttpError(502, 'Unable to reach Instagram');
        }
        if (response.error_message || response.error_type) {
            throw new httpError_1.HttpError(401, response.error_message ?? 'Invalid Instagram code');
        }
        if (!response.access_token) {
            throw new httpError_1.HttpError(502, 'Instagram access token missing');
        }
        return response.access_token;
    },
    async getProfile(accessToken) {
        let response;
        try {
            response = await requestInstagramProfile(accessToken);
        }
        catch {
            throw new httpError_1.HttpError(502, 'Unable to reach Instagram');
        }
        if (response.error?.message || response.error_message || response.error_type) {
            throw new httpError_1.HttpError(401, response.error?.message ?? response.error_message ?? 'Invalid Instagram token');
        }
        if (!response.username) {
            throw new httpError_1.HttpError(502, 'Instagram profile missing username');
        }
        return {
            handle: response.username,
            profilePictureUrl: response.profile_picture_url ?? null,
        };
    },
};
//# sourceMappingURL=instagramService.js.map