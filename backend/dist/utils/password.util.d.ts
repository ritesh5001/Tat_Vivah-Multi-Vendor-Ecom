/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compare a plain text password with a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns True if passwords match, false otherwise
 */
export declare function comparePassword(password: string, hashedPassword: string): Promise<boolean>;
/**
 * Hash a refresh token using bcrypt
 * @param token - Plain text refresh token
 * @returns Hashed token string
 */
export declare function hashToken(token: string): Promise<string>;
/**
 * Compare a plain text token with a hashed token
 * @param token - Plain text token to verify
 * @param hashedToken - Hashed token to compare against
 * @returns True if tokens match, false otherwise
 */
export declare function compareToken(token: string, hashedToken: string): Promise<boolean>;
//# sourceMappingURL=password.util.d.ts.map