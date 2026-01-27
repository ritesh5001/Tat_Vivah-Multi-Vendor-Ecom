
import { Request, Response, NextFunction } from 'express';
import { webhookService } from '../services/webhook.service.js';
import { asyncHandler } from '../middlewares/error.middleware.js';

export class WebhookController {

    handleWebhook = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { provider } = req.params;
        const payload = req.body;
        const signature = (req.headers['x-signature'] as string) || '';

        if (!provider) {
            throw new Error("Provider is required");
        }

        await webhookService.processWebhook(provider, payload, signature);

        res.status(200).json({
            success: true,
            message: 'Webhook processed'
        });
    });
}

export const webhookController = new WebhookController();
