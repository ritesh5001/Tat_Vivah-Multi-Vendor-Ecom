import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';

/**
 * Seller Routes
 * Base path: /v1/seller
 */
const sellerRouter = Router();

/**
 * POST /v1/seller/register
 * Register a new SELLER (status = PENDING)
 */
sellerRouter.post('/register', authController.registerSeller);

export { sellerRouter };
