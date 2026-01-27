import { PrismaClient } from '@prisma/client';
/**
 * Prisma client instance with logging based on environment
 */
export declare const prisma: PrismaClient;
/**
 * Graceful shutdown handler for Prisma connection
 */
export declare function disconnectDatabase(): Promise<void>;
/**
 * Health check for database connection
 */
export declare function checkDatabaseConnection(): Promise<boolean>;
//# sourceMappingURL=db.d.ts.map