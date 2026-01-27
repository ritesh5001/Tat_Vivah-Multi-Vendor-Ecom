import { z } from 'zod';
/**
 * User Registration Validation Schema
 * POST /v1/auth/register
 */
export declare const registerUserSchema: z.ZodObject<{
    fullName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    fullName: string;
    password: string;
}, {
    email: string;
    phone: string;
    fullName: string;
    password: string;
}>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
/**
 * Seller Registration Validation Schema
 * POST /v1/seller/register
 */
export declare const registerSellerSchema: z.ZodObject<{
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    password: string;
}, {
    email: string;
    phone: string;
    password: string;
}>;
export type RegisterSellerInput = z.infer<typeof registerSellerSchema>;
/**
 * Login Validation Schema
 * POST /v1/auth/login
 */
export declare const loginSchema: z.ZodObject<{
    identifier: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    identifier: string;
}, {
    password: string;
    identifier: string;
}>;
export type LoginInput = z.infer<typeof loginSchema>;
/**
 * Refresh Token Validation Schema
 * POST /v1/auth/refresh
 */
export declare const refreshTokenSchema: z.ZodObject<{
    refreshToken: z.ZodString;
}, "strip", z.ZodTypeAny, {
    refreshToken: string;
}, {
    refreshToken: string;
}>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
/**
 * Logout Validation Schema
 * POST /v1/auth/logout
 */
export declare const logoutSchema: z.ZodObject<{
    refreshToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    refreshToken?: string | undefined;
}, {
    refreshToken?: string | undefined;
}>;
export type LogoutInput = z.infer<typeof logoutSchema>;
//# sourceMappingURL=auth.validation.d.ts.map