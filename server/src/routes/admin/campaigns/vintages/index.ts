import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection } from "../../../../services/auditedCollection.ts"
import { db } from "../../../../services/mongo.ts"
import type { Vintage, VintageNew } from "../../../../types/vintage.ts"

const router = Router()
const collection = "vintages"
const prefix = `/admin/campaigns/:campaignId/${collection}`
const auditedCampaigns = auditedCollection(collection)

// /admin/campaigns/:campaignId/vintages
router.route(prefix)
  .get(async (req, res) => {
    const campaignId = new ObjectId(req.params.campaignId)
    const response = await db.collection(collection).find({ campaignId }).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaignId = new ObjectId(req.params.campaignId)
    const vintage: VintageNew = {
      campaignId,
      name: req.body.name,
      status: req.body.status,
    }
    if (req.body?.closingDate) vintage.closingDate = req.body.closingDate
    if (req.body?.openingDate) vintage.openingDate = req.body.openingDate
    const errors: { name?: string, status?: string } = {}
    if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The vintage name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Save vintage into MongoDB
    const vintageId = await auditedCampaigns.insertOne(vintage)

    res.status(201).json({
      message: `Vintage ${vintage.name} added. id: ${vintageId}`,
    })
  })

router.route(`${prefix}/:vintageId`)
  .get(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    const response = await db.collection(collection).aggregate([
      { $match: { _id } },
      { $limit: 1 },
    ])
      .toArray()
    if (response.length === 1) return res.status(200).json(response[0])
    res.status(404).json({ message: `No vintage found with id ${_id}` })
  })
  .patch(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    const { _id: _, ...vintage }: Vintage = req.body
    const errors: { name?: string, status?: string } = {}
    if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Update vintage into MongoDB
    const vintageId = new ObjectId(_id)
    await db.collection(collection).updateOne({ _id: vintageId }, { $set: { ...vintage } })

    res.status(200).json({
      message: `Vintage ${vintage.name} modified. id: ${_id}`,
    })
  })
  .delete(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    await db.collection(collection).deleteOne({ _id })
    res.status(200).json({
      message: `Vintage deleted. id: ${_id}`
    })
  })

export default router
