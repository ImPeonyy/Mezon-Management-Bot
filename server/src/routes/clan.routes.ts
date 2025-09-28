import { Router } from "express";
import { getClanWithEventMessagesAPI } from "@/api/clan/clan.api";

const router = Router();

/**
 * @route GET /api/clan/:id
 * @desc Get clan with event messages by ID
 * @access Public
 * @param id - Clan ID
 */
router.get("/:id", getClanWithEventMessagesAPI);

export default router;
