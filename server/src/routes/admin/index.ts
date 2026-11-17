import { Router } from "express"

import campaignsRoutes from "./campaigns/index.ts"
import usersRoutes from "./users/index.ts"
import vintageRoutes from "./vintages/index.ts"

const router = Router()
router.use("/admin", campaignsRoutes)
router.use("/admin", usersRoutes)
router.use("/admin", vintageRoutes)
export default router
