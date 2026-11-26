import { Router } from "express"

import { auditedCollection as audit } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { UserNew } from "../../../types/user.ts"

const router = Router()
const collection = "users"
const prefix = `/admin/${collection}`
const auditedCollection = audit(collection)

// /admin/users
router
  .route(prefix)
  .get(async (_req, res) => {
    const response = await db.collection(collection).find().toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const user: UserNew = {
      email: req.body.email,
      firstName: req.body.firstName,
      isActive: true,
      lastName: req.body.lastName,
      role: "user",
    }
    const response = await auditedCollection.insertOne(user)
    res.status(201).json({
      message: `User ${user.firstName} ${user.lastName} added. id: ${response?.insertedId}`,
    })
  })

export default router
