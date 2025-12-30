import { prisma } from '../src/db/client';
import { HttpError } from '../src/lib/httpError';
import { logger } from '../src/lib/logger';
import { instagramService } from '../src/services/instagramService';

type InstagramUserRow = {
  id: string;
  instagramAccessToken: string | null;
};

const fetchUsersWithTokens = async (): Promise<InstagramUserRow[]> =>
  prisma.user.findMany({
    where: { instagramAccessToken: { not: null } },
    select: { id: true, instagramAccessToken: true },
  });

const updateInstagramProfile = async (user: InstagramUserRow) => {
  if (!user.instagramAccessToken) {
    return null;
  }

  const profile = await instagramService.getProfile(user.instagramAccessToken);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      instagramHandle: profile.handle,
      instagramProfilePictureUrl: profile.profilePictureUrl,
    },
  });

  return profile;
};

const main = async () => {
  logger.info('Instagram profile sync started');

  const users = await fetchUsersWithTokens();
  logger.info('Instagram users fetched', { count: users.length });

  let updated = 0;
  let failed = 0;

  for (const user of users) {
    try {
      const profile = await updateInstagramProfile(user);
      if (profile) {
        updated += 1;
        logger.info('Instagram profile updated', { userId: user.id, handle: profile.handle });
      }
    } catch (error) {
      failed += 1;

      if (error instanceof HttpError) {
        logger.warn('Instagram profile update failed', {
          userId: user.id,
          statusCode: error.statusCode,
          message: error.message,
        });
      } else if (error instanceof Error) {
        logger.warn('Instagram profile update failed', { userId: user.id, message: error.message });
      } else {
        logger.warn('Instagram profile update failed', { userId: user.id });
      }
    }
  }

  logger.info('Instagram profile sync completed', { updated, failed });
};

void main()
  .catch((error) => {
    logger.error('Instagram profile sync crashed', error instanceof Error ? { message: error.message } : undefined);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
