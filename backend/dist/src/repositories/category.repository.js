import { prisma } from '../config/db.js';
/**
 * Category Repository
 * Handles database operations for categories
 */
export class CategoryRepository {
    /**
     * Find all active categories
     */
    async findAllActive() {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }
    /**
     * Find category by slug
     */
    async findBySlug(slug) {
        return prisma.category.findUnique({
            where: { slug },
        });
    }
    /**
     * Find category by ID
     */
    async findById(id) {
        return prisma.category.findUnique({
            where: { id },
        });
    }
    /**
     * Check if category exists and is active
     */
    async existsAndActive(id) {
        const category = await prisma.category.findFirst({
            where: { id, isActive: true },
            select: { id: true },
        });
        return category !== null;
    }
}
// Export singleton instance
export const categoryRepository = new CategoryRepository();
//# sourceMappingURL=category.repository.js.map