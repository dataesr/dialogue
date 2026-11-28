import { Router } from "express";

import campaignsRoutes from "./campaigns/index.ts";
import structuresRoutes from "./structures/index.ts";
import logsRoutes from "./audit-logs/index.ts";
import usersRoutes from "./users/index.ts";

const router = Router();
router.use(campaignsRoutes);
router.use(logsRoutes);
router.use(structuresRoutes);
router.use(usersRoutes);
export default router;
