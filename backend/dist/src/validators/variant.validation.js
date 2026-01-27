import { z } from 'zod';
/**
 * Create Variant Validation Schema
 * POST /v1/seller/products/:id/variants
 */
export const createVariantSchema = z.object({
    sku: z
        .string()
        .min(1, 'SKU is required')
        .max(100, 'SKU must be at most 100 characters'),
    price: z
        .number()
        .positive('Price must be positive'),
    compareAtPrice: z
        .number()
        .positive('Compare at price must be positive')
        .optional(),
    initialStock: z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative')
        .optional()
        .default(0),
});
/**
 * Update Variant Validation Schema
 * PUT /v1/seller/variants/:id
 */
export const updateVariantSchema = z.object({
    price: z
        .number()
        .positive('Price must be positive')
        .optional(),
    compareAtPrice: z
        .number()
        .positive('Compare at price must be positive')
        .nullable()
        .optional(),
});
/**
 * Update Stock Validation Schema
 * PUT /v1/seller/variants/:id/stock
 */
export const updateStockSchema = z.object({
    stock: z
        .number()
        .int('Stock must be an integer')
        .min(0, 'Stock cannot be negative'),
});
//# sourceMappingURL=variant.validation.js.map