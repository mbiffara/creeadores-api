import { z } from 'zod';
export declare const companyCreateSchema: z.ZodObject<{
    companyName: z.ZodString;
    name: z.ZodString;
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    phone: z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodOptional<z.ZodString>>;
    password: z.ZodString;
}, z.core.$strip>;
export type CompanyCreatePayload = z.infer<typeof companyCreateSchema>;
//# sourceMappingURL=company.d.ts.map