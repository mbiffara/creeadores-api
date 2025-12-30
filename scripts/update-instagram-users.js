"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../src/db/client");
const httpError_1 = require("../src/lib/httpError");
const logger_1 = require("../src/lib/logger");
const instagramService_1 = require("../src/services/instagramService");
const fetchUsersWithTokens = async () => client_1.prisma.user.findMany({
    where: { instagramAccessToken: { not: null } },
    select: { id: true, instagramAccessToken: true },
});
const updateInstagramProfile = async (user) => {
    if (!user.instagramAccessToken) {
        return null;
    }
    const profile = await instagramService_1.instagramService.getProfile(user.instagramAccessToken);
    await client_1.prisma.user.update({
        where: { id: user.id },
        data: {
            instagramHandle: profile.handle,
            instagramProfilePictureUrl: profile.profilePictureUrl,
        },
    });
    return profile;
};
const main = async () => {
    logger_1.logger.info('Instagram profile sync started');
    const users = await fetchUsersWithTokens();
    logger_1.logger.info('Instagram users fetched', { count: users.length });
    let updated = 0;
    let failed = 0;
    for (const user of users) {
        try {
            const profile = await updateInstagramProfile(user);
            if (profile) {
                updated += 1;
                logger_1.logger.info('Instagram profile updated', { userId: user.id, handle: profile.handle });
            }
        }
        catch (error) {
            failed += 1;
            if (error instanceof httpError_1.HttpError) {
                logger_1.logger.warn('Instagram profile update failed', {
                    userId: user.id,
                    statusCode: error.statusCode,
                    message: error.message,
                });
            }
            else if (error instanceof Error) {
                logger_1.logger.warn('Instagram profile update failed', { userId: user.id, message: error.message });
            }
            else {
                logger_1.logger.warn('Instagram profile update failed', { userId: user.id });
            }
        }
    }
    logger_1.logger.info('Instagram profile sync completed', { updated, failed });
};
void main()
    .catch((error) => {
    logger_1.logger.error('Instagram profile sync crashed', error instanceof Error ? { message: error.message } : undefined);
    process.exitCode = 1;
})
    .finally(async () => {
    await client_1.prisma.$disconnect();
});
//# sourceMappingURL=update-instagram-users.js.map