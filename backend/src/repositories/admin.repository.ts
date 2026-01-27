/**
 * Admin Repository
 * Database operations for admin panel
 */

import { prisma } from '../config/db.js';

// ============================================================================
// TYPES
// ============================================================================

export type ProductModerationStatusType = 'PENDING' | 'APPROVED' | 'REJECTED';
export type UserStatusType = 'PENDING' | 'ACTIVE' | 'SUSPENDED';
export type OrderStatusType = 'PLACED' | 'CONFIRMED' | 'CANCELLED' | 'SHIPPED' | 'DELIVERED';

export interface AdminSeller {
    id: string;
    email: string | null;
    phone: string | null;
    role: string;
    status: string;
    createdAt: Date;
}

export interface AdminProduct {
    id: string;
    title: string;
    sellerId: string;
    categoryId: string;
    isPublished: boolean;
    createdAt: Date;
    moderation: {
        status: string;
        reason: string | null;
        reviewedBy: string | null;
        reviewedAt: Date | null;
    } | null;
}

export interface AdminOrder {
    id: string;
    userId: string;
    status: string;
    totalAmount: number;
    createdAt: Date;
    items: {
        id: string;
        sellerId: string;
        productId: string;
        variantId: string;
        quantity: number;
        priceSnapshot: number;
    }[];
}

export interface AdminPayment {
    id: string;
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    providerPaymentId: string | null;
    createdAt: Date;
}

export interface AdminSettlement {
    id: string;
    sellerId: string;
    orderItemId: string;
    amount: number;
    status: string;
    createdAt: Date;
}

/**
 * Admin Repository Class
 * Handles all admin-related database queries
 */
export class AdminRepository {
    // =========================================================================
    // SELLER MANAGEMENT
    // =========================================================================

    /**
     * Find all sellers
     */
    async findAllSellers(): Promise<AdminSeller[]> {
        const sellers = await prisma.user.findMany({
            where: { role: 'SELLER' },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return sellers;
    }

    /**
     * Find seller by ID
     */
    async findSellerById(id: string): Promise<AdminSeller | null> {
        return prisma.user.findFirst({
            where: { id, role: 'SELLER' },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
    }

    /**
     * Update seller status
     */
    async updateSellerStatus(id: string, status: UserStatusType): Promise<AdminSeller> {
        return prisma.user.update({
            where: { id },
            data: { status },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                status: true,
                createdAt: true,
            },
        });
    }

    // =========================================================================
    // PRODUCT MODERATION
    // =========================================================================

    /**
     * Find all products pending moderation
     */
    async findPendingProducts(): Promise<AdminProduct[]> {
        const moderations = await prisma.productModeration.findMany({
            where: { status: 'PENDING' },
            include: {
                product: true,
            },
            orderBy: { created_at: 'desc' },
        });

        return moderations.map((mod) => ({
            id: mod.product.id,
            title: mod.product.title,
            sellerId: mod.product.sellerId,
            categoryId: mod.product.categoryId,
            isPublished: mod.product.isPublished,
            createdAt: mod.product.createdAt,
            moderation: {
                status: mod.status,
                reason: mod.reason,
                reviewedBy: mod.reviewedBy,
                reviewedAt: mod.reviewedAt,
            },
        }));
    }

    /**
     * Find product by ID with moderation info
     */
    async findProductById(id: string): Promise<AdminProduct | null> {
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) return null;

        const moderation = await prisma.productModeration.findUnique({
            where: { productId: id },
        });

        return {
            id: product.id,
            title: product.title,
            sellerId: product.sellerId,
            categoryId: product.categoryId,
            isPublished: product.isPublished,
            createdAt: product.createdAt,
            moderation: moderation
                ? {
                    status: moderation.status,
                    reason: moderation.reason,
                    reviewedBy: moderation.reviewedBy,
                    reviewedAt: moderation.reviewedAt,
                }
                : null,
        };
    }

    /**
     * Update product moderation status
     */
    async updateProductModeration(
        productId: string,
        status: ProductModerationStatusType,
        reviewedBy: string,
        reason?: string
    ): Promise<void> {
        await prisma.productModeration.upsert({
            where: { productId },
            update: {
                status,
                reason: reason ?? null,
                reviewedBy,
                reviewedAt: new Date(),
                updated_at: new Date(),
            },
            create: {
                productId,
                status,
                reason: reason ?? null,
                reviewedBy,
                reviewedAt: new Date(),
                updated_at: new Date(),
            },
        });
    }

    /**
     * Update product publish status
     */
    async updateProductPublishStatus(id: string, isPublished: boolean): Promise<AdminProduct> {
        const product = await prisma.product.update({
            where: { id },
            data: { isPublished },
        });

        const moderation = await prisma.productModeration.findUnique({
            where: { productId: id },
        });

        return {
            id: product.id,
            title: product.title,
            sellerId: product.sellerId,
            categoryId: product.categoryId,
            isPublished: product.isPublished,
            createdAt: product.createdAt,
            moderation: moderation
                ? {
                    status: moderation.status,
                    reason: moderation.reason,
                    reviewedBy: moderation.reviewedBy,
                    reviewedAt: moderation.reviewedAt,
                }
                : null,
        };
    }

    // =========================================================================
    // ORDER MANAGEMENT
    // =========================================================================

    /**
     * Find all orders
     */
    async findAllOrders(): Promise<AdminOrder[]> {
        const orders = await prisma.order.findMany({
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return orders.map((order) => ({
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                sellerId: item.sellerId,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceSnapshot: item.priceSnapshot,
            })),
        }));
    }

    /**
     * Find order by ID
     */
    async findOrderById(id: string): Promise<AdminOrder | null> {
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: true,
            },
        });

        if (!order) return null;

        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                sellerId: item.sellerId,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceSnapshot: item.priceSnapshot,
            })),
        };
    }

    /**
     * Update order status
     */
    async updateOrderStatus(id: string, status: OrderStatusType): Promise<AdminOrder> {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: {
                items: true,
            },
        });

        return {
            id: order.id,
            userId: order.userId,
            status: order.status,
            totalAmount: order.totalAmount,
            createdAt: order.createdAt,
            items: order.items.map((item) => ({
                id: item.id,
                sellerId: item.sellerId,
                productId: item.productId,
                variantId: item.variantId,
                quantity: item.quantity,
                priceSnapshot: item.priceSnapshot,
            })),
        };
    }

    // =========================================================================
    // PAYMENTS & SETTLEMENTS
    // =========================================================================

    /**
     * Find all payments
     */
    async findAllPayments(): Promise<AdminPayment[]> {
        const payments = await prisma.payment.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return payments.map((p) => ({
            id: p.id,
            orderId: p.orderId,
            userId: p.userId,
            amount: p.amount,
            currency: p.currency,
            status: p.status,
            provider: p.provider,
            providerPaymentId: p.providerPaymentId,
            createdAt: p.createdAt,
        }));
    }

    /**
     * Find all settlements
     */
    async findAllSettlements(): Promise<AdminSettlement[]> {
        const settlements = await prisma.sellerSettlement.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return settlements.map((s) => ({
            id: s.id,
            sellerId: s.sellerId,
            orderItemId: s.orderItemId,
            amount: s.amount,
            status: s.status,
            createdAt: s.createdAt,
        }));
    }
}

// Export singleton instance
export const adminRepository = new AdminRepository();
