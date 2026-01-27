import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
/**
 * Product Routes
 * Base path: /v1/products
 * All routes are PUBLIC (no auth required)
 */
const productRouter = Router();
// ============================================================================
// PUBLIC ROUTES
// ============================================================================
/**
 * GET /v1/products
 * List published products with pagination
 */
productRouter.get('/', productController.listProducts);
/**
 * GET /v1/products/:id
 * Get product by ID with full details
 */
productRouter.get('/:id', productController.getProduct);
export { productRouter };
//# sourceMappingURL=product.routes.js.map