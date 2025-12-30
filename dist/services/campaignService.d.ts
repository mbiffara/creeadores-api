import type { CampaignStatus } from '@prisma/client';
export type CreateCampaignInput = {
    brandId: string;
    title: string;
    summary: string;
    deliverableTypes: string[];
    budgetMin: number;
    budgetMax: number;
    currency?: string;
    dueDate?: string;
    creativeNotes?: string;
    heroAssetUrl?: string;
};
export type CampaignFilters = {
    brandId?: string;
    status?: CampaignStatus;
};
export declare const campaignService: {
    createCampaign(input: CreateCampaignInput): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        summary: string;
        deliverableTypes: string[];
        status: import(".prisma/client").$Enums.CampaignStatus;
        budgetMin: number;
        budgetMax: number;
        currency: string;
        dueDate: Date | null;
        creativeNotes: string | null;
        heroAssetUrl: string | null;
        brandId: string;
    }>;
    listCampaigns(filters?: CampaignFilters): Promise<({
        brand: {
            name: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        summary: string;
        deliverableTypes: string[];
        status: import(".prisma/client").$Enums.CampaignStatus;
        budgetMin: number;
        budgetMax: number;
        currency: string;
        dueDate: Date | null;
        creativeNotes: string | null;
        heroAssetUrl: string | null;
        brandId: string;
    })[]>;
};
//# sourceMappingURL=campaignService.d.ts.map