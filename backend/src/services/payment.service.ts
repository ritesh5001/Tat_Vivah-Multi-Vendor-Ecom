
import { paymentRepository } from '../repositories/payment.repository.js';
import { orderRepository } from '../repositories/order.repository.js';
import { PaymentProvider, PaymentStatus, PaymentEventType, SettlementStatus, OrderStatus } from '@prisma/client';
import { prisma } from '../config/db.js';
import { ApiError } from '../errors/ApiError.js';

export class PaymentService {

    async initiatePayment(userId: string, orderId: string, provider: PaymentProvider) {
        // 1. Validate Order
        const order = await orderRepository.findByIdAndUserId(orderId, userId);
        if (!order) {
            throw new ApiError(404, 'Order not found or access denied');
        }

        if (order.status !== 'PLACED' && order.status !== 'CANCELLED') {
            // Depending on business rules. Leaving check here as placeholder or strict rule.
        }

        // Check for existing successful payment
        const existingPayment = await paymentRepository.findPaymentByOrderId(orderId);
        if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
            throw new ApiError(400, 'Order already paid');
        }

        // Create Payment Record (INITIATED)
        let payment;
        if (existingPayment) {
            payment = await paymentRepository.updatePaymentStatus(existingPayment.id, PaymentStatus.INITIATED, null);
        } else {
            payment = await paymentRepository.createPayment({
                orderId,
                userId,
                amount: order.totalAmount,
                currency: 'INR',
                provider,
                status: PaymentStatus.INITIATED
            });
        }

        // Log Event
        await paymentRepository.createPaymentEvent({
            paymentId: payment.id,
            type: PaymentEventType.INITIATED,
            payload: { provider, amount: order.totalAmount }
        });

        // Mock Provider Response
        if (provider === PaymentProvider.MOCK) {
            return {
                paymentId: payment.id,
                providerPaymentId: `mock_${payment.id}`,
                checkoutUrl: `https://mock-gateway.com/pay/${payment.id}`,
                amount: order.totalAmount,
                currency: 'INR'
            };
        }

        // Handle other providers (placeholder)
        throw new ApiError(400, 'Provider not verified');
    }

    async getPaymentDetails(orderId: string, userId: string) {
        const payment = await paymentRepository.findPaymentByOrderId(orderId);
        if (!payment) {
            throw new ApiError(404, 'Payment not found');
        }
        // Verify ownership via userId
        if (payment.userId !== userId) {
            throw new ApiError(403, 'Unauthorized');
        }
        return payment;
    }

    async handlePaymentSuccess(paymentId: string, providerPaymentId: string, payload: any) {
        const payment = await paymentRepository.findPaymentById(paymentId);
        if (!payment) return;
        if (payment.status === PaymentStatus.SUCCESS) return; // Idempotency

        // Transactional Update
        await prisma.$transaction(async (tx) => {
            // 1. Update Payment
            await tx.payment.update({
                where: { id: paymentId },
                data: {
                    status: PaymentStatus.SUCCESS,
                    providerPaymentId
                }
            });

            // 2. Log Event
            await tx.paymentEvent.create({
                data: {
                    paymentId,
                    type: PaymentEventType.SUCCESS,
                    payload
                }
            });

            // 3. Update Order Status
            await tx.order.update({
                where: { id: payment.orderId },
                data: { status: OrderStatus.CONFIRMED }
            });

            // 4. Create Seller Settlements
            const orderItems = await tx.orderItem.findMany({
                where: { orderId: payment.orderId }
            });

            for (const item of orderItems) {
                await tx.sellerSettlement.create({
                    data: {
                        sellerId: item.sellerId,
                        orderItemId: item.id,
                        amount: item.priceSnapshot,
                        status: SettlementStatus.PENDING
                    }
                });
            }
        });
    }

    async handlePaymentFailure(paymentId: string, payload: any) {
        const payment = await paymentRepository.findPaymentById(paymentId);
        if (!payment) return;
        if (payment.status === PaymentStatus.SUCCESS) return;

        await prisma.$transaction(async (tx) => {
            await tx.payment.update({
                where: { id: paymentId },
                data: { status: PaymentStatus.FAILED }
            });

            await tx.paymentEvent.create({
                data: {
                    paymentId,
                    type: PaymentEventType.FAILED,
                    payload
                }
            });
        });
    }
}

export const paymentService = new PaymentService();
