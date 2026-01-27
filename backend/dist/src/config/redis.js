import { Redis } from '@upstash/redis';
import { env } from './env.js';
/**
 * Upstash Redis client singleton
 * Uses REST API for serverless compatibility
 */
export const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
});
/**
 * Health check for Redis connection
 */
export async function checkRedisConnection() {
    try {
        await redis.ping();
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=redis.js.map