import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma, disconnectDatabase } from './config/db.js';

/**
 * Start the server
 */
async function bootstrap(): Promise<void> {
    try {
        // Verify database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(env.PORT, () => {
            console.log(`🚀 Server running on port ${env.PORT}`);
            console.log(`📝 Environment: ${env.NODE_ENV}`);
        });

        // Graceful shutdown handlers
        const shutdown = async (signal: string): Promise<void> => {
            console.log(`\n${signal} received. Shutting down gracefully...`);

            server.close(async () => {
                console.log('🔒 HTTP server closed');
                await disconnectDatabase();
                process.exit(0);
            });

            // Force close after 10 seconds
            setTimeout(() => {
                console.error('⚠️ Forced shutdown after timeout');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        await disconnectDatabase();
        process.exit(1);
    }
}

// Start the application
bootstrap();
