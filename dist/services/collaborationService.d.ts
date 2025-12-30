import type { Prisma } from '@prisma/client';
export type InviteCreatorInput = {
    campaignId: string;
    creatorId: string;
    rateInCents?: number;
    currency?: string;
    notes?: string;
    deliverables?: Prisma.InputJsonValue;
};
export declare const collaborationService: {
    inviteCreator(input: InviteCreatorInput): Promise<{
        campaign: {
            id: string;
            brand: {
                name: string;
                id: string;
            };
            title: string;
        };
        creator: {
            email: string;
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CollaborationStatus;
        currency: string;
        campaignId: string;
        creatorId: string;
        rateInCents: number | null;
        deliverables: Prisma.JsonValue | null;
        notes: string | null;
        queueJobId: string | null;
        lastMessagedAt: Date | null;
    }>;
    listCollaborations(filters?: {
        campaignId?: string;
        creatorId?: string;
    }): Promise<({
        campaign: {
            id: string;
            title: string;
        };
        creator: {
            id: string;
            displayName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.CollaborationStatus;
        currency: string;
        campaignId: string;
        creatorId: string;
        rateInCents: number | null;
        deliverables: Prisma.JsonValue | null;
        notes: string | null;
        queueJobId: string | null;
        lastMessagedAt: Date | null;
    })[]>;
};
//# sourceMappingURL=collaborationService.d.ts.map