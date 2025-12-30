import { z } from 'zod';
export declare const emailSignUpSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export declare const googleSignUpSchema: z.ZodObject<{
    token: z.ZodString;
}, z.core.$strip>;
export declare const emailSignInSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export declare const instagramAuthSchema: z.ZodObject<{
    code: z.ZodString;
}, z.core.$strip>;
export type EmailSignUpPayload = z.infer<typeof emailSignUpSchema>;
export type GoogleSignUpPayload = z.infer<typeof googleSignUpSchema>;
export type EmailSignInPayload = z.infer<typeof emailSignInSchema>;
export type InstagramAuthPayload = z.infer<typeof instagramAuthSchema>;
//# sourceMappingURL=user.d.ts.map