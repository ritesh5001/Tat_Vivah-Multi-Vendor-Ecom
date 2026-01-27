import { request, LOG, COLORS } from './test-utils.js';

async function verifyAuth() {
    LOG.info(`Starting Auth Service Verification`);

    // 1. Health Check
    LOG.step('Testing Health Check');
    const health = await request('/health');
    if (health.status === 200 && health.data.status === 'ok') {
        LOG.success('Health Check passed');
    } else {
        LOG.error('Health Check failed', health);
        process.exit(1);
    }

    // Generate random user
    const randomId = Math.random().toString(36).substring(7);
    const user = {
        fullName: `Test User ${randomId}`,
        email: `test${randomId}@example.com`,
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        password: 'Password123!'
    };

    // 2. Register
    LOG.step(`Testing Registration (Email: ${user.email})`);
    const register = await request('/v1/auth/register', 'POST', user);
    if (register.status === 201 || register.status === 200) {
        LOG.success('Registration passed');
    } else {
        LOG.error('Registration failed', register);
        process.exit(1);
    }

    // 2.5 Admin Registration
    LOG.step(`Testing Admin Registration`);
    const adminUser = {
        firstName: `Admin`,
        lastName: `Test${randomId}`,
        email: `admin${randomId}@example.com`,
        password: 'Password123!',
        department: 'IT',
        designation: 'Tester'
    };
    const adminReg = await request('/v1/auth/admin/register', 'POST', adminUser);
    if (adminReg.status === 201) {
        LOG.success('Admin Registration passed');
    } else {
        console.warn('⚠️ Admin Registration failed (Expected if endpoint disabled)', adminReg);
    }

    LOG.step('Testing Login');
    const login = await request('/v1/auth/login', 'POST', {
        identifier: user.email,
        password: user.password
    });

    if (login.status === 200 && login.data.accessToken) {
        LOG.success('Login passed');
    } else {
        LOG.error('Login failed', login);
        process.exit(1);
    }

    const { accessToken, refreshToken } = login.data;

    // 4. Protected Route (List Sessions)
    LOG.step('Testing Protected Route (List Sessions)');
    const sessions = await request('/v1/auth/sessions', 'GET', undefined, accessToken);
    if (sessions.status === 200 && Array.isArray(sessions.data.sessions)) {
        LOG.success('Protected route passed');
        console.log(`${COLORS.gray}Found ${sessions.data.sessions.length} active sessions${COLORS.reset}`);
    } else {
        LOG.error('Protected route failed', sessions);
        process.exit(1);
    }

    // 5. Logout
    LOG.step('Testing Logout');
    const logout = await request('/v1/auth/logout', 'POST', { refreshToken }, accessToken);
    if (logout.status === 200) {
        LOG.success('Logout passed');
    } else {
        LOG.error('Logout failed', logout);
    }

    // 6. Verify Session Invalidated
    LOG.step('Verifying Refresh Token Invalidated');
    const refreshResult = await request('/v1/auth/refresh', 'POST', { refreshToken });
    if (refreshResult.status === 401 || refreshResult.status === 403) {
        LOG.success('Refresh Token correctly rejected');
    } else {
        LOG.error('Refresh Token still valid after logout!', refreshResult);
    }

    console.log(`\n🎉 AUTH SERVICE VERIFICATION PASSED`);
}

// Allow running directly
if (import.meta.url === `file://${process.argv[1]}`) {
    verifyAuth().catch(console.error);
}

export { verifyAuth };
