import { z } from 'zod';

/**
 * Checkout Validation Schema
 * POST /v1/checkout
 * Note: Checkout uses cart-based approach, so no body required
 */
export const checkoutSchema = z.object({}).optional();

export type CheckoutInput = z.infer<typeof checkoutSchema>;
