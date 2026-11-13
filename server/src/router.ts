import { Router } from "express"

import adminRoutes from "./routes/admin/index.ts"

const router = Router()
router.use(adminRoutes)
export default router