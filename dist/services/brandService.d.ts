export type CreateBrandInput = {
    name: string;
    contactEmail: string;
    contactName?: string;
    website?: string;
    industries?: string[];
};
export declare const brandService: {
    createBrand(input: CreateBrandInput): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string;
        contactName: string | null;
        website: string | null;
        industries: string[];
    }>;
    listBrands(): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        contactEmail: string;
        contactName: string | null;
        website: string | null;
        industries: string[];
    }[]>;
};
//# sourceMappingURL=brandService.d.ts.map