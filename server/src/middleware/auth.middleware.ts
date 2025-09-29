import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '@/utils/jwt.util';

// Extend Request interface để thêm user info
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
            };
        }
    }
}

/**
 * Middleware xác thực JWT token
 * Kiểm tra Authorization header và xác thực token
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7) // Bỏ "Bearer " prefix
            : null;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }

        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Thêm user info vào request
        req.user = {
            userId: decoded.userId
        };

        next();
    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

/**
 * Middleware xác thực JWT token tùy chọn
 * Nếu có token thì xác thực, nếu không có thì vẫn cho qua
 */
export const optionalAuthenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.startsWith('Bearer ') 
            ? authHeader.substring(7)
            : null;

        if (token) {
            const decoded = verifyToken(token);
            if (decoded) {
                req.user = {
                    userId: decoded.userId
                };
            }
        }

        next();
    } catch (error) {
        console.error('Optional authentication middleware error:', error);
        next(); // Vẫn cho qua nếu có lỗi
    }
};
