import { Router } from "express"

import { db } from "../../../services/mongo.ts"
import type { UserType } from "../../../types/user.ts"

const router = Router()
const name = "users"

// /admin/users
router
  .route(`/${name}`)
  .get(async (_req, res) => {
    const response = await db.collection(name).find({}).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const user: UserType = {
      createdAt: new Date(),
      email: req.body.email,
      firstName: req.body.firstName,
      isActive: true,
      lastName: req.body.lastName,
      role: "user",
    }
    const response = await db.collection(name).insertOne(user)
    res.status(201).json({
      message: `User ${user.firstName} ${user.lastName} added. id: ${response.insertedId}`,
    })
  })

export default router
