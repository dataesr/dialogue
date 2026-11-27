import { Router } from "express"

import campaignsRoutes from "./campaigns/index.ts"
// import logsRoutes from "./logs/index.ts";
import usersRoutes from "./users/index.ts"

const router = Router()
router.use(campaignsRoutes)
// router.use(logsRoutes);
router.use(usersRoutes)
export default router
