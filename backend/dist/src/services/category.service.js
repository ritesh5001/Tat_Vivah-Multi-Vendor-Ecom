import { categoryRepository } from '../repositories/category.repository.js';
import { getFromCache, setCache, CACHE_KEYS, } from '../utils/cache.util.js';
/**
 * Category Service
 * Business logic for category operations
 */
export class CategoryService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * List all active categories
     * Uses Redis caching
     */
    async listCategories() {
        // Try cache first
        const cached = await getFromCache(CACHE_KEYS.CATEGORIES_LIST);
        if (cached) {
            return cached;
        }
        // Fetch from database
        const categories = await this.repository.findAllActive();
        const response = { categories };
        // Cache the result
        await setCache(CACHE_KEYS.CATEGORIES_LIST, response);
        return response;
    }
}
// Export singleton instance with default repository
export const categoryService = new CategoryService(categoryRepository);
//# sourceMappingURL=category.service.js.map