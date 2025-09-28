import { loginUserAPI, refreshTokenAPI } from "@/api/auth/auth.api";
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

export default router;
