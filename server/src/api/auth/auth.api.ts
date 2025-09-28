import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from "./auth.interface";
import { authenticateUser } from "@/repositories/auth.repo";
import { generateToken, verifyToken } from "@/utils/jwt.util";
import { Request, Response } from "express";

export const loginUserAPI = async (req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse>) => {
    try {
        console.log("request body", req.body);
        const { id, password } = req.body;

        // Validate input
        if (!id || !password) {
            return res.status(400).json({
                success: false,
                message: "ID and password are required"
            });
        }

        // Authenticate user
        const user = await authenticateUser(id, password);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "ID or password is incorrect"
            });
        }

        // Generate JWT token
        const token = generateToken(user.id);
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: user,
                token: token,
                tokenType: 'Bearer',
                expiresIn: expiresIn
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const refreshTokenAPI = async (req: Request<{}, RefreshTokenResponse, RefreshTokenRequest>, res: Response<RefreshTokenResponse>) => {
    try {
        const { token } = req.body;

        // Validate input
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required"
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        // Generate new token
        const newToken = generateToken(decoded.userId);
        const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                token: newToken,
                tokenType: 'Bearer',
                expiresIn: expiresIn
            }
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};