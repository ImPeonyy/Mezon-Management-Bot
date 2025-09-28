import jwt, { SignOptions, Secret } from "jsonwebtoken";

// JWT Secret key - trong production nên lưu trong environment variables
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const options: SignOptions = { expiresIn: "1h" };


export interface JWTPayload {
    userId: string;
    iat?: number;
    exp?: number;
}

/**
 * Tạo JWT token
 * @param userId - ID của user
 * @returns JWT token string
 */
export const generateToken = (userId: string): string => {
    const payload = { userId };
    return jwt.sign(
        payload,
        JWT_SECRET,
        options
    );
};

/**
 * Xác thực JWT token
 * @param token - JWT token string
 * @returns Decoded payload hoặc null nếu token không hợp lệ
 */
export const verifyToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('JWT verification failed:', error);
        return null;
    }
};

/**
 * Decode JWT token mà không xác thực
 * @param token - JWT token string
 * @returns Decoded payload hoặc null
 */
export const decodeToken = (token: string): JWTPayload | null => {
    try {
        const decoded = jwt.decode(token) as JWTPayload;
        return decoded;
    } catch (error) {
        console.error('JWT decode failed:', error);
        return null;
    }
};

/**
 * Kiểm tra token có hết hạn không
 * @param token - JWT token string
 * @returns true nếu token hết hạn
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};
