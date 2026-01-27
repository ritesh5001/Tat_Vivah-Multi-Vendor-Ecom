import { prisma } from '../config/db.js';
import type { CategoryEntity } from '../types/product.types.js';

/**
 * Category Repository
 * Handles database operations for categories
 */
export class CategoryRepository {
    /**
     * Find all active categories
     */
    async findAllActive(): Promise<CategoryEntity[]> {
        return prisma.category.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    /**
     * Find category by slug
     */
    async findBySlug(slug: string): Promise<CategoryEntity | null> {
        return prisma.category.findUnique({
            where: { slug },
        });
    }

    /**
     * Find category by ID
     */
    async findById(id: string): Promise<CategoryEntity | null> {
        return prisma.category.findUnique({
            where: { id },
        });
    }

    /**
     * Check if category exists and is active
     */
    async existsAndActive(id: string): Promise<boolean> {
        const category = await prisma.category.findFirst({
            where: { id, isActive: true },
            select: { id: true },
        });
        return category !== null;
    }
}

// Export singleton instance
export const categoryRepository = new CategoryRepository();
