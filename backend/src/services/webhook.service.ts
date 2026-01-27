
import { paymentService } from './payment.service.js';
import { PaymentProvider } from '@prisma/client';
import { ApiError } from '../errors/ApiError.js';

export class WebhookService {

    async processWebhook(provider: string, payload: any, signature: string) {
        // 1. Validate Provider
        const validProvider = this.mapProvider(provider);
        if (!validProvider) {
            throw new ApiError(400, 'Invalid provider');
        }

        // 2. Verify Signature (Placeholder)
        this.verifySignature(validProvider, payload, signature);

        // 3. Extract Info
        if (validProvider === PaymentProvider.MOCK) {
            const { paymentId, status, providerPaymentId } = payload;

            if (status === 'SUCCESS') {
                await paymentService.handlePaymentSuccess(paymentId, providerPaymentId, payload);
            } else if (status === 'FAILED') {
                await paymentService.handlePaymentFailure(paymentId, payload);
            }
            return;
        }
    }

    private mapProvider(provider: string): PaymentProvider | null {
        const p = provider.toUpperCase();
        if (Object.values(PaymentProvider).includes(p as PaymentProvider)) {
            return p as PaymentProvider;
        }
        return null;
    }

    private verifySignature(provider: PaymentProvider, _payload: any, _signature: string) {
        // Placeholder logic
        if (provider === PaymentProvider.MOCK) return true;
        return true;
    }
}

export const webhookService = new WebhookService();
