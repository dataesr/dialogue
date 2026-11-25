import { Router } from "express"

import campaignsRoutes from "./campaigns/index.ts"
import usersRoutes from "./users/index.ts"

const router = Router()
router.use(campaignsRoutes)
router.use(usersRoutes)
export default router
