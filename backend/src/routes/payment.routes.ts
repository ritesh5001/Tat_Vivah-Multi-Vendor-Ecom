
import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validateRequest.js'; // Assuming this exists or similar
import { initiatePaymentSchema } from '../validators/payment.validation.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post(
    '/initiate',
    validateRequest(initiatePaymentSchema),
    paymentController.initiatePayment
);

router.get(
    '/:orderId',
    paymentController.getPaymentDetails
);

export const paymentRoutes = router;
