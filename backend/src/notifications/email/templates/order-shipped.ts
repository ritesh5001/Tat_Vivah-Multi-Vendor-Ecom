import { EmailTemplateResult } from '../../types.js';

export function orderShippedTemplate(data: { orderId: string, trackingNumber: string, carrier: string }): EmailTemplateResult {
    return {
        subject: `Your Order #${data.orderId} has Shipped!`,
        html: `
            <h1>Order Shipped</h1>
            <p>Your order is on the way.</p>
            <p><strong>Carrier:</strong> ${data.carrier}</p>
            <p><strong>Tracking Number:</strong> ${data.trackingNumber}</p>
        `
    };
}
