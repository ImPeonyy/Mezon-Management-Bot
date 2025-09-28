import { Request, Response } from "express";
import { authenticateUser, getUser } from "@/repositories/user.repo";
import { ApiResponse } from "@/constants";
import { LoginRequest, LoginResponse } from "./user.interface";

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

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: user
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getUserProfileAPI = async (req: Request<{ id: string }>, res: Response<ApiResponse>) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "ID is required"
            });
        }

        const user = await getUser(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return res.status(200).json({
            success: true,
            message: "Get user profile successful",
            data: userWithoutPassword
        });

    } catch (error) {
        console.error("Get user profile error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
