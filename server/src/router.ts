import { Router } from "express"

import adminRouter from "./routes/admin/index.ts"

const router = Router()
router.use("/admin", adminRouter)
export default router