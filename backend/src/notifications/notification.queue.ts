import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';
import { NotificationJobPayload } from './types.js';

// BullMQ requires a dedicated Redis connection with maxRetriesPerRequest set to null
const connection = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

connection.on('error', (err) => {
    console.error('Redis Queue Connection Error:', err);
});

export const notificationQueue = new Queue<NotificationJobPayload>('notification.queue', {
    connection,
    defaultJobOptions: {
        attempts: 5,
        backoff: {
            type: 'exponential',
            delay: 5000, // 5s, 10s, 20s...
        },
        removeOnComplete: 1000, // Keep last 1000
        removeOnFail: 5000,    // Keep last 5000 failed
    },
});
