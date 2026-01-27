import { PrismaClient } from '@prisma/client';
import { env } from '../src/config/env.js';

export const prisma = new PrismaClient();
export const BASE_URL = `http://localhost:${env.PORT}`;

export const COLORS = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
    gray: '\x1b[90m'
};

export const LOG = {
    info: (msg: string) => console.log(`${COLORS.cyan}[INFO]${COLORS.reset} ${msg}`),
    success: (msg: string) => console.log(`${COLORS.green}✅ [PASS]${COLORS.reset} ${msg}`),
    error: (msg: string, details?: any) => {
        console.error(`${COLORS.red}❌ [FAIL]${COLORS.reset} ${msg}`);
        if (details) console.error(COLORS.gray, JSON.stringify(details, null, 2), COLORS.reset);
    },
    step: (msg: string) => console.log(`\n👉 ${msg}`)
};

export async function request(path: string, method: string = 'GET', body?: any, token?: string): Promise<{ status: number; data: any }> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
        const response = await fetch(`${BASE_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null
        });

        const data = await response.json().catch(() => ({}));
        return { status: response.status, data };
    } catch (error) {
        return { status: 0, data: error };
    }
}

export async function ensureSeller() {
    const email = 'test-seller@verified.com';
    const phone = '9998887776';

    // Register via API to handle password hashing properly
    // We try to find first to avoid hitting API if not needed, but API handles idempotency usually (returns 409)
    // Actually our API returns 409 if exists.

    const registerRes = await request('/v1/seller/register', 'POST', {
        email,
        phone,
        password: 'Password123!'
    });

    if (registerRes.status === 201 || registerRes.status === 409) {
        // Force activate via Prisma
        await prisma.user.update({
            where: { email },
            data: {
                status: 'ACTIVE',
                role: 'SELLER',
                isEmailVerified: true,
                isPhoneVerified: true
            }
        });
        return { email, password: 'Password123!' };
    } else {
        throw new Error(`Failed to create/ensure seller: ${JSON.stringify(registerRes)}`);
    }
}

export async function ensureBuyer() {
    const email = 'test-buyer@verified.com';
    const phone = '1112223334';

    const registerRes = await request('/v1/auth/register', 'POST', {
        fullName: 'Test Buyer',
        email,
        phone,
        password: 'Password123!'
    });

    if (registerRes.status === 201 || registerRes.status === 409) {
        return { email, password: 'Password123!' };
    }
    throw new Error(`Failed to create buyer: ${JSON.stringify(registerRes)}`);
}
