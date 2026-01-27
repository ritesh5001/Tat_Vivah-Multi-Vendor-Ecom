import express, { type Application } from 'express';
import cors from 'cors';
import { errorMiddleware } from './middlewares/error.middleware.js';
import {
    authRouter,
    sellerRouter,
    categoryRouter,
    productRouter,
    sellerProductRouter,
    imagekitRouter,
    cartRouter,
    checkoutRouter,
    orderRouter,
    sellerOrderRouter,
} from './routes/index.js';
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpec } from "./docs/openapi.js";

/**
 * Create and configure Express application
 * 
 * This is the main application factory.
 * All routes are mounted here via the routes layer.
 */
export function createApp(): Application {
    const app = express();

    // =========================================================================
    // GLOBAL MIDDLEWARE
    // =========================================================================

    // Parse JSON bodies
    app.use(express.json());

    // Parse URL-encoded bodies
    app.use(express.urlencoded({ extended: true }));

    // Enable CORS
    app.use(cors({
        origin: process.env['CORS_ORIGIN'] ?? '*',
        credentials: true,
    }));

    // =========================================================================
    // DOCUMENTATION
    // =========================================================================

    app.use('/docs', apiReference({
        spec: {
            content: openApiSpec
        }
    } as Parameters<typeof apiReference>[0]));

    // =========================================================================
    // HEALTH CHECK
    // =========================================================================

    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    });

    app.get('/', (_req, res) => {
        res.json({
            message: 'Welcome to TatVivah API',
            version: '1.0.0'
        });
    });

    // =========================================================================
    // API ROUTES
    // =========================================================================

    app.use('/v1/auth', authRouter);
    app.use('/v1/seller', sellerRouter);
    app.use('/v1/categories', categoryRouter);
    app.use('/v1/products', productRouter);
    app.use('/v1/seller/products', sellerProductRouter);
    app.use('/v1/imagekit', imagekitRouter);

    // Cart & Orders domain
    app.use('/v1/cart', cartRouter);
    app.use('/v1/checkout', checkoutRouter);
    app.use('/v1/orders', orderRouter);
    app.use('/v1/seller/orders', sellerOrderRouter);

    // =========================================================================
    // ERROR HANDLING
    // =========================================================================

    // 404 handler for unmatched routes
    app.use((_req, res) => {
        res.status(404).json({
            success: false,
            error: {
                message: 'Route not found',
                statusCode: 404,
            },
        });
    });

    // Global error handler (must be last)
    app.use(errorMiddleware);

    return app;
}
