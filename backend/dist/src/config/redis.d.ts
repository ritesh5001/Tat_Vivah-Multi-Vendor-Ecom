import { Redis } from '@upstash/redis';
/**
 * Upstash Redis client singleton
 * Uses REST API for serverless compatibility
 */
export declare const redis: Redis;
/**
 * Health check for Redis connection
 */
export declare function checkRedisConnection(): Promise<boolean>;
//# sourceMappingURL=redis.d.ts.map