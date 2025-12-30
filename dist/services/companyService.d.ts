export type CreateCompanyInput = {
    companyName: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
};
export declare const companyService: {
    createCompanyWithOwner(input: CreateCompanyInput): Promise<{
        company: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string | null;
        };
        owner: {
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            phone: string | null;
            companyId: string;
        };
    }>;
};
//# sourceMappingURL=companyService.d.ts.map