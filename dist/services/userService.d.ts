export type EmailSignUpInput = {
    email: string;
    password: string;
};
export type GoogleSignUpInput = {
    token: string;
};
export declare const userService: {
    registerWithEmail(input: EmailSignUpInput): Promise<{
        name: string;
        email: string;
        id: string;
        username: string;
        signUpMethod: import(".prisma/client").$Enums.SignUpMethod;
        phoneNumber: string | null;
        country: string | null;
        instagramHandle: string | null;
        instagramProfilePictureUrl: string | null;
        instagramConnectedAt: Date | null;
        tiktokHandle: string | null;
        youtubeHandle: string | null;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    registerWithGoogle(input: GoogleSignUpInput): Promise<{
        name: string;
        email: string;
        id: string;
        username: string;
        signUpMethod: import(".prisma/client").$Enums.SignUpMethod;
        phoneNumber: string | null;
        country: string | null;
        instagramHandle: string | null;
        instagramProfilePictureUrl: string | null;
        instagramConnectedAt: Date | null;
        tiktokHandle: string | null;
        youtubeHandle: string | null;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    authenticateWithEmail(email: string, password: string): Promise<{
        name: string;
        email: string;
        id: string;
        username: string;
        signUpMethod: import(".prisma/client").$Enums.SignUpMethod;
        phoneNumber: string | null;
        country: string | null;
        instagramHandle: string | null;
        instagramProfilePictureUrl: string | null;
        instagramConnectedAt: Date | null;
        tiktokHandle: string | null;
        youtubeHandle: string | null;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getUserById(id: string): Promise<{
        instagramConnected: boolean;
        name: string;
        email: string;
        id: string;
        username: string;
        signUpMethod: import(".prisma/client").$Enums.SignUpMethod;
        phoneNumber: string | null;
        country: string | null;
        instagramHandle: string | null;
        instagramProfilePictureUrl: string | null;
        instagramConnectedAt: Date | null;
        tiktokHandle: string | null;
        youtubeHandle: string | null;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    connectInstagram(userId: string, accessToken: string, handle: string, profilePictureUrl: string | null): Promise<void>;
    listUsers(): Promise<{
        name: string;
        email: string;
        id: string;
        username: string;
        signUpMethod: import(".prisma/client").$Enums.SignUpMethod;
        phoneNumber: string | null;
        country: string | null;
        instagramHandle: string | null;
        instagramProfilePictureUrl: string | null;
        instagramConnectedAt: Date | null;
        tiktokHandle: string | null;
        youtubeHandle: string | null;
        verifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
};
//# sourceMappingURL=userService.d.ts.map