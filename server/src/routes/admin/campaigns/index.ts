import { Router } from "express"

import { db } from "../../../services/mongo.ts"

const router = Router()

router.route("")
  .get(async (_, res) => {
    const response = await db.collection("campaigns").find({}).toArray()
    res.json(response)
  })
  .post(async (_, res) => {
    const response = await db.collection("campaigns").insertOne({
      name: "New campaign2"
    })
    res.json({
      message: "Campaign successfully added",
      campaign: response.insertedId,
    })
  })

export default router