export declare const instagramService: {
    exchangeCodeForToken(code: string): Promise<string>;
    getProfile(accessToken: string): Promise<{
        handle: string;
        profilePictureUrl: string | null;
    }>;
};
//# sourceMappingURL=instagramService.d.ts.map