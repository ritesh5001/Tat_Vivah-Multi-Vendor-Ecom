import { authRepository } from '../repositories/auth.repository.js';
import { hashPassword, comparePassword, hashToken, compareToken } from '../utils/password.util.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util.js';
import { ApiError } from '../errors/ApiError.js';
import { env } from '../config/env.js';
import ms from 'ms';
/**
 * Auth Service
 * Contains all business logic for authentication
 * Testable and independent of HTTP layer
 */
export class AuthService {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Register a new USER
     * POST /v1/auth/register
     *
     * Business Rules:
     * 1. Check if email OR phone already exists
     * 2. Hash password
     * 3. Create user with role=USER, status=ACTIVE
     * 4. No JWT generation, no auto-login
     */
    async registerUser(data) {
        // 1. Check if email or phone already exists
        const exists = await this.repository.existsByEmailOrPhone(data.email, data.phone);
        if (exists) {
            throw ApiError.conflict('Email or phone already in use');
        }
        // 2. Hash password
        const passwordHash = await hashPassword(data.password);
        // 3. Create user (transaction handled in repository)
        await this.repository.createUser({
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: 'USER',
            status: 'ACTIVE',
            isEmailVerified: false,
            isPhoneVerified: false,
        });
        // 4. Return success message (no token, no auto-login)
        return {
            message: 'User registered successfully',
        };
    }
    /**
     * Register a new SELLER
     * POST /v1/seller/register
     *
     * Business Rules:
     * 1. Check if email OR phone already exists
     * 2. Hash password
     * 3. Create user with role=SELLER, status=PENDING
     * 4. No JWT generation, no auto-login
     * 5. Seller cannot login until approved
     */
    async registerSeller(data) {
        // 1. Check if email or phone already exists
        const exists = await this.repository.existsByEmailOrPhone(data.email, data.phone);
        if (exists) {
            throw ApiError.conflict('Email or phone already in use');
        }
        // 2. Hash password
        const passwordHash = await hashPassword(data.password);
        // 3. Create user with SELLER role and PENDING status
        await this.repository.createUser({
            email: data.email,
            phone: data.phone,
            passwordHash,
            role: 'SELLER',
            status: 'PENDING',
            isEmailVerified: false,
            isPhoneVerified: false,
        });
        // 4. Return success message (no token, pending approval)
        return {
            message: 'Seller registration submitted for approval',
        };
    }
    /**
     * Login user
     * POST /v1/auth/login
     *
     * Business Rules:
     * 1. Find user by email OR phone
     * 2. Verify password
     * 3. Check status (must be ACTIVE)
     * 4. Generate tokens
     * 5. Create login session with HASHED refresh token
     */
    async login(identifier, password, userAgent, ipAddress) {
        // 1. Find user by email OR phone
        const user = await this.repository.findByIdentifier(identifier);
        if (!user) {
            throw ApiError.unauthorized('Invalid credentials');
        }
        // 2. Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);
        if (!isPasswordValid) {
            throw ApiError.unauthorized('Invalid credentials');
        }
        // 3. Check status (must be ACTIVE)
        if (user.status !== 'ACTIVE') {
            throw ApiError.forbidden('Account not active');
        }
        // 4. Generate tokens
        const accessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        });
        // Calculate refresh token expiry
        const refreshTokenExpiryMs = ms(env.REFRESH_TOKEN_EXPIRY);
        const expiresAt = new Date(Date.now() + refreshTokenExpiryMs);
        // Create session first to get session ID for refresh token
        const session = await this.repository.createSession({
            userId: user.id,
            refreshToken: '', // Placeholder, will update with hash
            userAgent: userAgent ?? undefined,
            ipAddress: ipAddress ?? undefined,
            expiresAt,
        });
        // Generate refresh token with session ID
        const refreshToken = generateRefreshToken({
            userId: user.id,
            sessionId: session.id,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        });
        // Hash the refresh token before storing
        const hashedRefreshToken = await hashToken(refreshToken);
        // Update session with hashed refresh token
        await this.repository.updateSessionRefreshToken(session.id, hashedRefreshToken);
        // 5. Return response
        return {
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
            },
            accessToken,
            refreshToken,
        };
    }
    /**
     * Refresh tokens with rotation
     * POST /v1/auth/refresh
     *
     * Business Rules:
     * 1. Verify refresh token JWT signature & expiry
     * 2. Extract userId from payload
     * 3. Find matching session by comparing token hash
     * 4. If not found → invalidate ALL user sessions (token reuse attack)
     * 5. Generate new tokens
     * 6. Update session with new hashed refresh token
     * 7. Return new tokens
     */
    async refreshTokens(refreshToken) {
        // 1. Verify refresh token JWT (throws if invalid/expired)
        const decoded = verifyRefreshToken(refreshToken);
        const { userId, sessionId } = decoded;
        // 2. Get all sessions for this user
        const sessions = await this.repository.findSessionsByUserId(userId);
        // 3. Find matching session by comparing refresh token hash
        let matchingSession;
        for (const session of sessions) {
            const isMatch = await compareToken(refreshToken, session.refreshToken);
            if (isMatch) {
                matchingSession = session;
                break;
            }
        }
        // 4. If no matching session found, potential token reuse attack
        if (!matchingSession) {
            // Invalidate ALL sessions for this user (security measure)
            await this.repository.deleteAllUserSessions(userId);
            throw ApiError.unauthorized('Invalid refresh token');
        }
        // Check session expiry
        if (matchingSession.expiresAt < new Date()) {
            await this.repository.deleteSession(matchingSession.id);
            throw ApiError.unauthorized('Refresh token has expired');
        }
        // 5. Get user data for new access token
        const user = await this.repository.findUserById(userId);
        if (!user) {
            await this.repository.deleteSession(matchingSession.id);
            throw ApiError.unauthorized('User not found');
        }
        // Check user status
        if (user.status !== 'ACTIVE') {
            await this.repository.deleteSession(matchingSession.id);
            throw ApiError.forbidden('Account not active');
        }
        // 6. Generate new tokens
        const newAccessToken = generateAccessToken({
            userId: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        });
        const newRefreshToken = generateRefreshToken({
            userId: user.id,
            sessionId: sessionId,
            isEmailVerified: user.isEmailVerified,
            isPhoneVerified: user.isPhoneVerified,
        });
        // 7. Hash new refresh token and update session
        const hashedNewRefreshToken = await hashToken(newRefreshToken);
        await this.repository.updateSessionRefreshToken(matchingSession.id, hashedNewRefreshToken);
        // 8. Return new tokens
        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }
    /**
     * Logout current session
     * POST /v1/auth/logout
     *
     * Business Rules:
     * 1. Find matching session by userId and refresh token hash
     * 2. Delete the session
     * 3. Return success (idempotent - success even if session not found)
     */
    async logout(userId, refreshToken) {
        if (refreshToken) {
            // Find and delete matching session by comparing token hash
            const sessions = await this.repository.findSessionsByUserId(userId);
            for (const session of sessions) {
                const isMatch = await compareToken(refreshToken, session.refreshToken);
                if (isMatch) {
                    await this.repository.deleteSession(session.id);
                    break;
                }
            }
        }
        // Idempotent - always return success
        return { message: 'Logged out successfully' };
    }
    /**
     * List all user sessions
     * GET /v1/auth/sessions
     */
    async listSessions(userId) {
        const sessions = await this.repository.getSessionsForUser(userId);
        return {
            sessions: sessions.map(session => ({
                sessionId: session.id,
                userAgent: session.userAgent,
                ipAddress: session.ipAddress,
                createdAt: session.createdAt,
                updatedAt: session.updatedAt,
            })),
        };
    }
    /**
     * Revoke a specific session
     * DELETE /v1/auth/sessions/:sessionId
     */
    async revokeSession(userId, sessionId) {
        const deleted = await this.repository.deleteUserSession(userId, sessionId);
        if (!deleted) {
            throw ApiError.notFound('Session not found');
        }
        return { message: 'Session revoked successfully' };
    }
}
// Export singleton instance with default repository
export const authService = new AuthService(authRepository);
//# sourceMappingURL=auth.service.js.map