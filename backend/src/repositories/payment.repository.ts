
import { prisma } from '../config/db.js';
import { Payment, PaymentEvent, PaymentStatus, PaymentEventType } from '@prisma/client';

export class PaymentRepository {

    async createPayment(data: {
        orderId: string;
        userId: string;
        amount: number;
        currency: string;
        provider: any;
        status: PaymentStatus;
    }): Promise<Payment> {
        return prisma.payment.create({
            data
        });
    }

    async findPaymentByOrderId(orderId: string): Promise<Payment | null> {
        return prisma.payment.findUnique({
            where: { orderId },
            include: {
                events: true
            }
        });
    }

    async findPaymentById(paymentId: string): Promise<Payment | null> {
        return prisma.payment.findUnique({
            where: { id: paymentId },
            include: {
                events: true,
                order: true
            }
        });
    }

    async updatePaymentStatus(
        paymentId: string,
        status: PaymentStatus,
        providerPaymentId?: string | null
    ): Promise<Payment> {
        const data: any = { status };
        if (providerPaymentId) {
            data.providerPaymentId = providerPaymentId;
        }

        return prisma.payment.update({
            where: { id: paymentId },
            data
        });
    }

    async createPaymentEvent(data: {
        paymentId: string;
        type: PaymentEventType;
        payload?: any;
    }): Promise<PaymentEvent> {
        return prisma.paymentEvent.create({
            data: {
                paymentId: data.paymentId,
                type: data.type,
                payload: data.payload || {}
            }
        });
    }
}

export const paymentRepository = new PaymentRepository();
