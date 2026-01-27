import { PrismaClient } from '@prisma/client';
import { env } from './env.js';
/**
 * Prisma client singleton
 * Ensures only one instance is created across the application
 */
const globalForPrisma = globalThis;
/**
 * Prisma client instance with logging based on environment
 */
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
// Prevent multiple instances in development (hot reloading)
if (env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}
/**
 * Graceful shutdown handler for Prisma connection
 */
export async function disconnectDatabase() {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
}
/**
 * Health check for database connection
 */
export async function checkDatabaseConnection() {
    try {
        await prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=db.js.map