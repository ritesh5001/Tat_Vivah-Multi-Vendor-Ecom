import { EmailTemplateResult } from '../../types.js';

export function orderDeliveredTemplate(data: { orderId: string }): EmailTemplateResult {
    return {
        subject: `Order #${data.orderId} Delivered`,
        html: `
            <h1>Order Delivered</h1>
            <p>Your order has been delivered.</p>
            <p>Enjoy your purchase!</p>
        `
    };
}
