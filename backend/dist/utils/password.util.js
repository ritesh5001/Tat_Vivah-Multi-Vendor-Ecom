import bcrypt from 'bcrypt';
/**
 * Number of salt rounds for bcrypt hashing
 * Higher = more secure but slower
 */
const SALT_ROUNDS = 12;
/**
 * Lower salt rounds for refresh tokens (faster, still secure)
 */
const TOKEN_SALT_ROUNDS = 10;
/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
}
/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
/**
 * Hash a refresh token using bcrypt
 * @param token - Plain text refresh token
 * @returns Hashed token string
 */
export async function hashToken(token) {
    return bcrypt.hash(token, TOKEN_SALT_ROUNDS);
}
/**
 * Compare a plain text token with a hashed token
 * @param token - Plain text token to verify
 * @param hashedToken - Hashed token to compare against
 * @returns True if tokens match, false otherwise
 */
export async function compareToken(token, hashedToken) {
    return bcrypt.compare(token, hashedToken);
}
//# sourceMappingURL=password.util.js.map