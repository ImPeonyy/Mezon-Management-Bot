import { Router } from "express";
import userRoutes from "./user.routes";
import clanRoutes from "./clan.routes";
import eventMessageRoutes from "./eventMessage.routes";

const router = Router();

// Mount user routes
router.use("/user", userRoutes);
router.use("/clan", clanRoutes);
router.use("/event-msg", eventMessageRoutes);


export default router;
