import { Router } from "express";
import { getUserProfileAPI } from "@/api/user/user.api";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

/**
 * @route GET /api/users/:id
 * @desc Get user profile by ID
 * @access Public
 * @param id - User ID
 */
router.get("/:id", getUserProfileAPI, authenticateToken);

export default router;
