import { Router } from "express"

import campaignsRoutes from "./campaigns/index.ts"

const router = Router()
router.use("admin", campaignsRoutes)
export default router