import { Router } from "express";
import { updateEventMessageAPI } from "@/api/event-message/eventMessage.api";
import { authenticateToken } from "@/middleware/auth.middleware";

const router = Router();

/**
 * @route PUT /api/event-msg/:id
 * @desc Update event message by ID
 * @access Private
 * @param id - Event Message ID
 */
router.put("/:id", authenticateToken, updateEventMessageAPI);

export default router;
