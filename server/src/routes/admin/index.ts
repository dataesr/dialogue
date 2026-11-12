import { Router } from "express"

import campaignsRouter from "./campaigns/index.ts"

const router = Router()
router.use("/campaigns", campaignsRouter)
export default router