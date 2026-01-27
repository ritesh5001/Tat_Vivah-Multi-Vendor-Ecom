import type { Request, Response, NextFunction } from 'express';
/**
 * Checkout Controller
 * Handles HTTP requests for checkout operations
 */
export declare class CheckoutController {
    /**
     * Process checkout
     * POST /v1/checkout
     */
    checkout(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const checkoutController: CheckoutController;
//# sourceMappingURL=checkout.controller.d.ts.map