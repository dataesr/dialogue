import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection as audit } from "../../../../../services/auditedCollection.ts"
import { db } from "../../../../../services/mongo.ts"
import type { Space, SpaceNew } from "../../../../../types/space.ts"

const router = Router()
const collection = "spaces"
const prefix = `/admin/campaigns/:campaignId/vintages/:vintageId/${collection}`
const auditedCollection = audit(collection)

// /admin/campaigns/:campaignId/vintages/:vintageId/spaces
router.route(prefix)
  .get(async (req, res) => {
    const vintageId = new ObjectId(req.params.vintageId)
    const response = await db.collection(collection).find({ vintageId }).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const vintageId = new ObjectId(req.params.vintageId)
    const space: SpaceNew = {
      structureId: req.body.structureId,
      type: req.body.type,
      vintageId,
    }
    if (req.body?.closedAt) space.closedAt = req.body.closedAt
    if (req.body?.closedBy) space.closedBy = req.body.closedBy
    if (req.body?.closureReason) space.closureReason = req.body.closureReason
    const response = await auditedCollection.insertOne(space)
    res.status(201).json({
      message: `Space added. id: ${response?.insertedId}`,
    })
  })

router.route(`${prefix}/:spaceId`)
  .get(async (req, res) => {
    const _id = new ObjectId(req.params.spaceId)
    const response = await db.collection(collection).aggregate([
      { $match: { _id } },
      { $limit: 1 },
    ])
      .toArray()
    if (response.length === 1) return res.status(200).json(response[0])
    res.status(404).json({ message: `No space found with id ${_id}` })
  })
  .patch(async (req, res) => {
    const _id = new ObjectId(req.params.spaceId)
    const { _id: _, ...space }: Space = req.body
    // const errors: { name?: string, status?: string } = {}
    // if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    // if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })
    const spaceId = new ObjectId(_id)
    const response = await auditedCollection.updateOne({ _id: spaceId }, { $set: { ...space } })
    res.status(200).json({
      message: `Space modified. id: ${response?._id}`,
    })
  })
  .delete(async (req, res) => {
    const _id = new ObjectId(req.params.spaceId)
    const response = await auditedCollection.deleteOne({ _id })
    res.status(200).json({
      message: `Space deleted. Number of spaces deleted: ${response?.deletedCount}`
    })
  })

export default router
