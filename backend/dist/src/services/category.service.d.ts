import { CategoryRepository } from '../repositories/category.repository.js';
import type { CategoryListResponse } from '../types/product.types.js';
/**
 * Category Service
 * Business logic for category operations
 */
export declare class CategoryService {
    private readonly repository;
    constructor(repository: CategoryRepository);
    /**
     * List all active categories
     * Uses Redis caching
     */
    listCategories(): Promise<CategoryListResponse>;
}
export declare const categoryService: CategoryService;
//# sourceMappingURL=category.service.d.ts.map