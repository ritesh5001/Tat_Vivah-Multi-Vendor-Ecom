import { z } from 'zod';
/**
 * Create Product Validation Schema
 * POST /v1/seller/products
 */
export declare const createProductSchema: z.ZodObject<{
    categoryId: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    categoryId: string;
    title: string;
    isPublished: boolean;
    description?: string | undefined;
}, {
    categoryId: string;
    title: string;
    description?: string | undefined;
    isPublished?: boolean | undefined;
}>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
/**
 * Update Product Validation Schema
 * PUT /v1/seller/products/:id
 */
export declare const updateProductSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    isPublished: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    categoryId?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isPublished?: boolean | undefined;
}, {
    categoryId?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    isPublished?: boolean | undefined;
}>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
/**
 * Product Query Validation Schema
 * GET /v1/products
 */
export declare const productQuerySchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>>;
    categoryId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    search?: string | undefined;
    categoryId?: string | undefined;
}, {
    search?: string | undefined;
    categoryId?: string | undefined;
    page?: string | undefined;
    limit?: string | undefined;
}>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
//# sourceMappingURL=product.validation.d.ts.map