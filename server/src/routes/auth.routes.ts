import { loginUserAPI, refreshTokenAPI, changePasswordAPI } from "@/api/auth/auth.api";
import { authenticateToken } from "@/middleware/auth.middleware";
import { Router } from "express";

const router = Router();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 * @body { id: string, password: string }
 */
router.post("/login", loginUserAPI);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Public
 * @body { token: string }
 */
router.post("/refresh", refreshTokenAPI);

/**
 * @route PUT /api/auth/change-password
 * @desc Change user password
 * @access Private
 * @body { currentPassword: string, newPassword: string }
 */
router.put("/change-password", authenticateToken, changePasswordAPI);

export default router;
