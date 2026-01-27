
import { z } from 'zod';
import { PaymentProvider } from '@prisma/client';

export const initiatePaymentSchema = z.object({
    body: z.object({
        orderId: z.string().uuid().or(z.string().cuid()), // Assuming CUIDs but flexible
        provider: z.nativeEnum(PaymentProvider)
    })
});

export const webhookSchema = z.object({
    params: z.object({
        provider: z.string() // Validated in service, but we can refine here if needed
    }),
    body: z.any()
});
