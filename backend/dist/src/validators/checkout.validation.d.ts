import { z } from 'zod';
/**
 * Checkout Validation Schema
 * POST /v1/checkout
 * Note: Checkout uses cart-based approach, so no body required
 */
export declare const checkoutSchema: z.ZodOptional<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
//# sourceMappingURL=checkout.validation.d.ts.map