import https from 'node:https';
import { URLSearchParams } from 'node:url';
import { env } from '../config/env';
import { HttpError } from '../lib/httpError';

type InstagramTokenResponse = {
  access_token?: string;
  user_id?: number;
  error_type?: string;
  error_message?: string;
};

type InstagramProfileResponse = {
  id?: string;
  username?: string;
  profile_picture_url?: string;
  error?: {
    message?: string;
    type?: string;
  };
  error_type?: string;
  error_message?: string;
};

const requestInstagramToken = (body: string) =>
  new Promise<InstagramTokenResponse>((resolve, reject) => {
    const request = https.request(
      'https://api.instagram.com/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(body).toString(),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const payload = JSON.parse(data) as InstagramTokenResponse;
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on('error', reject);
    request.write(body);
    request.end();
  });

const requestInstagramProfile = (accessToken: string) =>
  new Promise<InstagramProfileResponse>((resolve, reject) => {
    const params = new URLSearchParams({
      fields: 'id,username,profile_picture_url',
      access_token: accessToken,
    });

    https
      .get(`https://graph.instagram.com/me?${params.toString()}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const payload = JSON.parse(data) as InstagramProfileResponse;
            resolve(payload);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject);
  });

export const instagramService = {
  async exchangeCodeForToken(code: string) {
    if (!env.INSTAGRAM_CLIENT_ID || !env.INSTAGRAM_CLIENT_SECRET || !env.INSTAGRAM_REDIRECT_URI) {
      throw new HttpError(500, 'Instagram OAuth is not configured');
    }

    const body = new URLSearchParams({
      client_id: env.INSTAGRAM_CLIENT_ID,
      client_secret: env.INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: env.INSTAGRAM_REDIRECT_URI,
      code,
    }).toString();

    let response: InstagramTokenResponse;

    try {
      response = await requestInstagramToken(body);
    } catch {
      throw new HttpError(502, 'Unable to reach Instagram');
    }

    if (response.error_message || response.error_type) {
      throw new HttpError(401, response.error_message ?? 'Invalid Instagram code');
    }

    if (!response.access_token) {
      throw new HttpError(502, 'Instagram access token missing');
    }

    return response.access_token;
  },

  async getProfile(accessToken: string) {
    let response: InstagramProfileResponse;

    try {
      response = await requestInstagramProfile(accessToken);
    } catch {
      throw new HttpError(502, 'Unable to reach Instagram');
    }

    if (response.error?.message || response.error_message || response.error_type) {
      throw new HttpError(401, response.error?.message ?? response.error_message ?? 'Invalid Instagram token');
    }

    if (!response.username) {
      throw new HttpError(502, 'Instagram profile missing username');
    }

    return {
      handle: response.username,
      profilePictureUrl: response.profile_picture_url ?? null,
    };
  },
};
