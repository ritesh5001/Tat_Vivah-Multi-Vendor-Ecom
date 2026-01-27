import { CategoryRepository, categoryRepository } from '../repositories/category.repository.js';
import {
    getFromCache,
    setCache,
    CACHE_KEYS,
} from '../utils/cache.util.js';
import type { CategoryListResponse } from '../types/product.types.js';

/**
 * Category Service
 * Business logic for category operations
 */
export class CategoryService {
    constructor(private readonly repository: CategoryRepository) { }

    /**
     * List all active categories
     * Uses Redis caching
     */
    async listCategories(): Promise<CategoryListResponse> {
        // Try cache first
        const cached = await getFromCache<CategoryListResponse>(CACHE_KEYS.CATEGORIES_LIST);
        if (cached) {
            return cached;
        }

        // Fetch from database
        const categories = await this.repository.findAllActive();
        const response: CategoryListResponse = { categories };

        // Cache the result
        await setCache(CACHE_KEYS.CATEGORIES_LIST, response);

        return response;
    }
}

// Export singleton instance with default repository
export const categoryService = new CategoryService(categoryRepository);
