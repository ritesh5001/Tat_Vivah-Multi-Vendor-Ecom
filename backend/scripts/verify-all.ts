import { verifyAuth } from './verify-auth.js';
import { verifyProduct } from './verify-product.js';
import { verifyCart } from './verify-cart.js';
import { verifyOrders } from './verify-orders.js';
import { verifyPayment } from './verify-payment.js';
import { prisma } from './test-utils.js';

async function runAll() {
    try {
        await verifyAuth();
        console.log('\n----------------------------------------\n');
        await verifyProduct();
        console.log('\n----------------------------------------\n');
        await verifyCart();
        console.log('\n----------------------------------------\n');
        await verifyOrders();
        console.log('\n----------------------------------------\n');
        await verifyPayment();
        console.log('\n✅ ALL SYSTEMS GO! ✨');
    } catch (error) {
        console.error('Verification failed:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

runAll().catch(console.error);
