import { Router } from "express";
import { loginUserAPI, getUserProfileAPI } from "@/api/user/user.api";

const router = Router();

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 * @body { id: string, password: string }
 */
router.post("/login", loginUserAPI);

/**
 * @route GET /api/users/:id
 * @desc Get user profile by ID
 * @access Public
 * @param id - User ID
 */
router.get("/:id", getUserProfileAPI);

export default router;
