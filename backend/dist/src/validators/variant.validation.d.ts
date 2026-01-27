import { z } from 'zod';
/**
 * Create Variant Validation Schema
 * POST /v1/seller/products/:id/variants
 */
export declare const createVariantSchema: z.ZodObject<{
    sku: z.ZodString;
    price: z.ZodNumber;
    compareAtPrice: z.ZodOptional<z.ZodNumber>;
    initialStock: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    sku: string;
    price: number;
    initialStock: number;
    compareAtPrice?: number | undefined;
}, {
    sku: string;
    price: number;
    compareAtPrice?: number | undefined;
    initialStock?: number | undefined;
}>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
/**
 * Update Variant Validation Schema
 * PUT /v1/seller/variants/:id
 */
export declare const updateVariantSchema: z.ZodObject<{
    price: z.ZodOptional<z.ZodNumber>;
    compareAtPrice: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    price?: number | undefined;
    compareAtPrice?: number | null | undefined;
}, {
    price?: number | undefined;
    compareAtPrice?: number | null | undefined;
}>;
export type UpdateVariantInput = z.infer<typeof updateVariantSchema>;
/**
 * Update Stock Validation Schema
 * PUT /v1/seller/variants/:id/stock
 */
export declare const updateStockSchema: z.ZodObject<{
    stock: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    stock: number;
}, {
    stock: number;
}>;
export type UpdateStockInput = z.infer<typeof updateStockSchema>;
//# sourceMappingURL=variant.validation.d.ts.map