/**
 * Admin Controller
 * HTTP handlers for admin panel endpoints
 */

import type { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';
import { auditService } from '../services/audit.service.js';
import type { AuditLogFilters, AuditEntityType } from '../repositories/audit.repository.js';

/**
 * Admin Controller
 * Handles HTTP requests for admin panel
 */
export const adminController = {
    // =========================================================================
    // SELLER MANAGEMENT
    // =========================================================================

    /**
     * GET /v1/admin/sellers
     * List all sellers
     */
    listSellers: async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await adminService.listSellers();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/sellers/:id/approve
     * Approve a pending seller
     */
    approveSeller: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const actorId = req.user!.userId as string;
            const result = await adminService.approveSeller(id, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/sellers/:id/suspend
     * Suspend a seller
     */
    suspendSeller: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const actorId = req.user!.userId as string;
            const result = await adminService.suspendSeller(id, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =========================================================================
    // PRODUCT MODERATION
    // =========================================================================

    /**
     * GET /v1/admin/products/pending
     * List products pending moderation
     */
    listPendingProducts: async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await adminService.listPendingProducts();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/products/:id/approve
     * Approve a product
     */
    approveProduct: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const actorId = req.user!.userId as string;
            const result = await adminService.approveProduct(id, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/products/:id/reject
     * Reject a product
     */
    rejectProduct: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const { reason } = req.body as { reason: string };
            const actorId = req.user!.userId as string;
            const result = await adminService.rejectProduct(id, reason, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =========================================================================
    // ORDER MANAGEMENT
    // =========================================================================

    /**
     * GET /v1/admin/orders
     * List all orders
     */
    listOrders: async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await adminService.listOrders();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/orders/:id/cancel
     * Cancel an order
     */
    cancelOrder: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const actorId = req.user!.userId as string;
            const result = await adminService.cancelOrder(id, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * PUT /v1/admin/orders/:id/force-confirm
     * Force confirm an order (SUPER_ADMIN only)
     */
    forceConfirmOrder: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const id = req.params['id'] as string;
            const actorId = req.user!.userId as string;
            const result = await adminService.forceConfirmOrder(id, actorId);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =========================================================================
    // PAYMENTS & SETTLEMENTS
    // =========================================================================

    /**
     * GET /v1/admin/payments
     * List all payments
     */
    listPayments: async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await adminService.listPayments();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /v1/admin/settlements
     * List all settlements
     */
    listSettlements: async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await adminService.listSettlements();
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    // =========================================================================
    // AUDIT LOGS
    // =========================================================================

    /**
     * GET /v1/admin/audit-logs
     * List audit logs with optional filters
     */
    listAuditLogs: async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { entityType, entityId, actorId, startDate, endDate } = req.query;

            const filters: AuditLogFilters = {};

            if (entityType && typeof entityType === 'string') {
                filters.entityType = entityType as AuditEntityType;
            }
            if (entityId && typeof entityId === 'string') {
                filters.entityId = entityId;
            }
            if (actorId && typeof actorId === 'string') {
                filters.actorId = actorId;
            }
            if (startDate && typeof startDate === 'string') {
                filters.startDate = new Date(startDate);
            }
            if (endDate && typeof endDate === 'string') {
                filters.endDate = new Date(endDate);
            }

            const result = await auditService.getAuditLogs(filters);
            res.json(result);
        } catch (error) {
            next(error);
        }
    },
};
