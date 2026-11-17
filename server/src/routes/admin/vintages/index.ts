import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { VintageType } from "../../../types/vintage.ts"

const router = Router()
const name = "vintages"
const auditedVintages = auditedCollection(name)

// /admin/vintages
router
  .route(`/${name}`)
  .get(async (_req, res) => {
    const response = await db.collection(name).find({}).toArray()
    res.json(response)
  })
  .patch(async (req, res) => {
    const { _id, ...vintage }: VintageType & { _id: ObjectId } = req.body
    const vintageId = new ObjectId(_id)
    await db.collection(name).updateOne({ _id: vintageId }, { $set: { ...vintage } })
    res.status(200).json({
      message: `Vintage ${vintage.name} added. id: ${_id}`,
    })
  })
  .post(async (req, res) => {
    // set defaults for vintage
    const vintageId = new ObjectId()
    const vintage: VintageType & { _id: ObjectId } = {
      _id: vintageId,
      name: req.body.name,
      status: req.body?.status ?? "draft",
    }
    // optional fields
    if (req.body?.closingDate) vintage.closingDate = req.body.closingDate
    if (req.body?.openingDate) vintage.openingDate = req.body.openingDate

    // Save vintage into MongoDB
    await auditedVintages.insertOne(vintage)

    res.status(201).json({
      message: `Vintage ${vintage.name} added. id: ${vintageId}`,
    })
  })

router.route(`/${name}/:id`).get(async (req, res) => {
  const _id = new ObjectId(req.params.id)
  const response = await db.collection(name).findOne({ _id })
  res.json(response)
})

export default router
