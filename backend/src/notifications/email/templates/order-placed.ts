import { EmailTemplateResult } from '../../types.js';

export function orderPlacedTemplate(data: { orderId: string, totalAmount: number }): EmailTemplateResult {
    return {
        subject: `Order Confirmed #${data.orderId}`,
        html: `
            <h1>Order Confirmation</h1>
            <p>Thank you for your order!</p>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Total Amount:</strong> ₹${data.totalAmount}</p>
            <p>We will notify you when it ships.</p>
        `
    };
}
