import { Router } from "express";
import { updateEventMessageAPI } from "@/api/event-message/eventMessage.api";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

/**
 * @route PUT /api/event-msg/:id
 * @desc Update event message by ID
 * @access Public
 * @param id - Event Message ID
 */
router.put("/:id", updateEventMessageAPI, authenticateToken);

export default router;
