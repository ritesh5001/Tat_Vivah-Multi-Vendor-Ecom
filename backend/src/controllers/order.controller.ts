import type { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';

/**
 * Order Controller
 * Handles HTTP requests for order viewing (buyer and seller)
 */
export class OrderController {
    // =========================================================================
    // BUYER METHODS
    // =========================================================================

    /**
     * List buyer's orders
     * GET /v1/orders
     */
    async listBuyerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const result = await orderService.listBuyerOrders(userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get buyer's order detail
     * GET /v1/orders/:id
     */
    async getBuyerOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user!.userId;
            const orderId = req.params.id as string;
            const result = await orderService.getBuyerOrder(orderId, userId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    // =========================================================================
    // SELLER METHODS
    // =========================================================================

    /**
     * List seller's order items
     * GET /v1/seller/orders
     */
    async listSellerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user!.userId;
            const result = await orderService.listSellerOrders(sellerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get seller's order detail
     * GET /v1/seller/orders/:id
     */
    async getSellerOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user!.userId;
            const orderId = req.params.id as string;
            const result = await orderService.getSellerOrder(orderId, sellerId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

// Export singleton instance
export const orderController = new OrderController();
