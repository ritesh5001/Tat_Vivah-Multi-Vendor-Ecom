/**
 * Admin Routes
 * Routes for admin panel endpoints with role-based access control
 */

import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { adminController } from '../controllers/admin.controller.js';

export const adminRouter = Router();

// ============================================================================
// All routes require authentication
// ============================================================================
adminRouter.use(authenticate);

// ============================================================================
// SELLER MANAGEMENT (ADMIN + SUPER_ADMIN)
// ============================================================================

/**
 * GET /v1/admin/sellers
 * List all sellers
 */
adminRouter.get(
    '/sellers',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listSellers
);

/**
 * PUT /v1/admin/sellers/:id/approve
 * Approve a pending seller
 */
adminRouter.put(
    '/sellers/:id/approve',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.approveSeller
);

/**
 * PUT /v1/admin/sellers/:id/suspend
 * Suspend a seller
 */
adminRouter.put(
    '/sellers/:id/suspend',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.suspendSeller
);

// ============================================================================
// PRODUCT MODERATION (ADMIN + SUPER_ADMIN)
// ============================================================================

/**
 * GET /v1/admin/products/pending
 * List products pending moderation
 */
adminRouter.get(
    '/products/pending',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listPendingProducts
);

/**
 * GET /v1/admin/products
 * List all products
 */
adminRouter.get(
    '/products',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listAllProducts
);

/**
 * PUT /v1/admin/products/:id/approve
 * Approve a product
 */
adminRouter.put(
    '/products/:id/approve',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.approveProduct
);

/**
 * PUT /v1/admin/products/:id/reject
 * Reject a product
 */
adminRouter.put(
    '/products/:id/reject',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.rejectProduct
);

/**
 * DELETE /v1/admin/products/:id
 * Delete a product (soft delete)
 */
adminRouter.delete(
    '/products/:id',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.deleteProduct
);

// ============================================================================
// ORDER MANAGEMENT
// ============================================================================

/**
 * GET /v1/admin/orders
 * List all orders
 */
adminRouter.get(
    '/orders',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listOrders
);

/**
 * PUT /v1/admin/orders/:id/cancel
 * Cancel an order (ADMIN + SUPER_ADMIN)
 */
adminRouter.put(
    '/orders/:id/cancel',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.cancelOrder
);

/**
 * PUT /v1/admin/orders/:id/force-confirm
 * Force confirm an order - SUPER_ADMIN ONLY
 * This bypasses payment verification
 */
adminRouter.put(
    '/orders/:id/force-confirm',
    authorize('SUPER_ADMIN'),
    adminController.forceConfirmOrder
);

// ============================================================================
// PAYMENTS & SETTLEMENTS (READ-ONLY)
// ============================================================================

/**
 * GET /v1/admin/payments
 * List all payments
 */
adminRouter.get(
    '/payments',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listPayments
);

/**
 * GET /v1/admin/settlements
 * List all settlements
 */
adminRouter.get(
    '/settlements',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listSettlements
);

// ============================================================================
// AUDIT LOGS
// ============================================================================

/**
 * GET /v1/admin/audit-logs
 * List audit logs with optional filters
 */
adminRouter.get(
    '/audit-logs',
    authorize('ADMIN', 'SUPER_ADMIN'),
    adminController.listAuditLogs
);
