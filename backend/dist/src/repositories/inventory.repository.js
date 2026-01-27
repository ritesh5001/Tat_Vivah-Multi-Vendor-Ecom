import { prisma } from '../config/db.js';
/**
 * Inventory Repository
 * Handles database operations for inventory
 */
export class InventoryRepository {
    /**
     * Update stock for a variant
     */
    async updateStock(variantId, stock) {
        return prisma.inventory.upsert({
            where: { variantId },
            update: { stock },
            create: {
                variantId,
                stock,
            },
        });
    }
    /**
     * Find inventory by variant ID
     */
    async findByVariantId(variantId) {
        return prisma.inventory.findUnique({
            where: { variantId },
        });
    }
    /**
     * Get current stock
     */
    async getStock(variantId) {
        const inventory = await prisma.inventory.findUnique({
            where: { variantId },
            select: { stock: true },
        });
        return inventory?.stock ?? 0;
    }
}
// Export singleton instance
export const inventoryRepository = new InventoryRepository();
//# sourceMappingURL=inventory.repository.js.map