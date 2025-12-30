import type { Prisma } from '@prisma/client';
export type CreateCreatorInput = {
    displayName: string;
    email: string;
    instagram?: string;
    tiktok?: string;
    niches?: string[];
    languages?: string[];
    location?: string;
    bio?: string;
    rateCardMin?: number;
    rateCardMax?: number;
    timezone?: string;
};
export type CreatorFilters = {
    niche?: string;
    search?: string;
};
export declare const creatorService: {
    createCreator(input: CreateCreatorInput): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        instagram: string | null;
        tiktok: string | null;
        niches: string[];
        languages: string[];
        location: string | null;
        bio: string | null;
        socialHandles: Prisma.JsonValue | null;
        rateCardMin: number | null;
        rateCardMax: number | null;
        timezone: string;
    }>;
    listCreators(filters?: CreatorFilters): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        displayName: string;
        instagram: string | null;
        tiktok: string | null;
        niches: string[];
        languages: string[];
        location: string | null;
        bio: string | null;
        socialHandles: Prisma.JsonValue | null;
        rateCardMin: number | null;
        rateCardMax: number | null;
        timezone: string;
    }[]>;
};
//# sourceMappingURL=creatorService.d.ts.map