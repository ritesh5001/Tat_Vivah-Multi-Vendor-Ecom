import { z } from 'zod';
/**
 * Environment variable schema with validation
 */
declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    PORT: z.ZodDefault<z.ZodEffects<z.ZodString, number, string>>;
    DATABASE_URL: z.ZodString;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    ACCESS_TOKEN_EXPIRY: z.ZodDefault<z.ZodString>;
    REFRESH_TOKEN_EXPIRY: z.ZodDefault<z.ZodString>;
    UPSTASH_REDIS_REST_URL: z.ZodString;
    UPSTASH_REDIS_REST_TOKEN: z.ZodString;
}, "strip", z.ZodTypeAny, {
    NODE_ENV: "production" | "development" | "test";
    PORT: number;
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    ACCESS_TOKEN_EXPIRY: string;
    REFRESH_TOKEN_EXPIRY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
}, {
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    NODE_ENV?: "production" | "development" | "test" | undefined;
    PORT?: string | undefined;
    ACCESS_TOKEN_EXPIRY?: string | undefined;
    REFRESH_TOKEN_EXPIRY?: string | undefined;
}>;
/**
 * Parsed and validated environment variables type
 */
export type Env = z.infer<typeof envSchema>;
/**
 * Validated environment configuration
 * Singleton pattern - parsed once on import
 */
export declare const env: Env;
export {};
//# sourceMappingURL=env.d.ts.map