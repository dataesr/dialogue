import { Router } from "express"

import { db } from "../../../services/mongo.ts"
import type { userType } from "../../../types/user.ts"

const router = Router()
const name = "users"

// /admin/users
router
  .route(`/${name}`)
  .get(async (_, res) => {
    const response = await db.collection(name).find({}).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const user: Omit<userType, "_id"> = {
      createdAt: new Date(),
      email: req.body.email,
      firstName: req.body.firstName,
      isActive: true,
      lastName: req.body.lastName,
      role: "user",
    }
    const response = await db.collection(name).insertOne(user)
    res.json({
      message: "User successfully added",
      userId: response.insertedId,
    })
  })

export default router
