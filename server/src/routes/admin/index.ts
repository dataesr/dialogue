import { Router } from "express"

import campaignsRoutes from "./campaigns/index.ts"
import usersRoutes from "./users/index.ts"

const router = Router()
router.use("/admin", campaignsRoutes)
router.use("/admin", usersRoutes)
export default router
