import { Router } from "express"

import { db } from "../../../services/mongo.ts"
import type { UserNewType } from "../../../types/user.ts"

const router = Router()
const collection = "users"
const prefix = `/admin/${collection}`

// /admin/users
router
  .route(prefix)
  .get(async (_req, res) => {
    const response = await db.collection(collection).find().toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const user: UserNewType = {
      email: req.body.email,
      firstName: req.body.firstName,
      isActive: true,
      lastName: req.body.lastName,
      role: "user",
    }
    const response = await db.collection(collection).insertOne(user)
    res.status(201).json({
      message: `User ${user.firstName} ${user.lastName} added. id: ${response.insertedId}`,
    })
  })

export default router
