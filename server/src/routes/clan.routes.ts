import { Router } from "express";
import { getClanWithEventMessagesAPI, getAllClansAPI } from "@/api/clan/clan.api";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

/**
 * @route GET /api/clan
 * @desc Get all clans
 * @access Private
 */
router.get("/", authenticateToken, getAllClansAPI);

/**
 * @route GET /api/clan/:id
 * @desc Get clan with event messages by ID
 * @access Private
 * @param id - Clan ID
 */
router.get("/:id", authenticateToken, getClanWithEventMessagesAPI);

export default router;
