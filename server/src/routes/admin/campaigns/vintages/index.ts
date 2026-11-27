import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection as audit } from "../../../../services/auditedCollection.ts"
import { db } from "../../../../services/mongo.ts"
import type { Vintage, VintageNew } from "../../../../types/vintage.ts"
import stagesRoutes from "./spaces/index.ts"

const router = Router()
const collection = "vintages"
const prefix = `/admin/campaigns/:campaignId/${collection}`
const auditedCollection = audit(collection)
const spacesCollection = "spaces"
const spacesAuditedCollection = audit(spacesCollection)

// /admin/campaigns/:campaignId/vintages
router.route(prefix)
  .get(async (req, res) => {
    const campaignId = new ObjectId(req.params.campaignId)
    const response = await db.collection(collection).aggregate([
      { $match: { campaignId } },
      {
        $project: {
          modifiedAt: 0,
          modifiedBy: 0,
        }
      },
      {
        $lookup: {
          from: "spaces",
          localField: "_id",
          foreignField: "vintageId",
          as: "spaces",
        }
      },
      {
        $project: {
          _id: 1,
          affiliationType: 1,
          campaignId: 1,
          closesAt: 1,
          description: 1,
          name: 1,
          numberOfSpaces: { $size: "$spaces" },
          opensAt: 1,
          publishedAt: 1,
          shortDescription: 1,
          spaces: 1,
          status: 1,
        }
      }
    ]).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaignId = new ObjectId(req.params.campaignId)
    const vintage: VintageNew = {
      campaignId,
      name: req.body.name,
      status: req.body.status,
    }
    if (req.body?.closesAt) vintage.closesAt = req.body.closesAt
    if (req.body?.opensAt) vintage.opensAt = req.body.opensAt
    const errors: { name?: string, status?: string } = {}
    if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The vintage name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join("\n") })
    const response = await auditedCollection.insertOne(vintage)
    res.status(201).json({
      message: `Vintage ${vintage.name} added. id: ${response?.insertedId}`,
    })
  })

router.route(`${prefix}/:vintageId`)
  .get(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    const response = await db.collection(collection).aggregate([
      { $match: { _id } },
      { $limit: 1 },
      {
        $lookup: {
          from: "spaces",
          localField: "_id",
          foreignField: "vintageId",
          as: "spaces",
        },
      },
    ]).toArray()
    if (response.length === 1) return res.status(200).json(response[0])
    res.status(404).json({ message: `No vintage found with id ${_id}` })
  })
  .patch(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    const { _id: _, ...vintage }: Vintage = req.body
    const errors: { name?: string, status?: string } = {}
    if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join("\n") })
    const vintageId = new ObjectId(_id)
    const response = await auditedCollection.updateOne({ _id: vintageId }, { $set: { ...vintage } })
    res.status(200).json({
      message: `Vintage ${vintage.name} modified. id: ${response?._id}`,
    })
  })
  .delete(async (req, res) => {
    const _id = new ObjectId(req.params.vintageId)
    const response = await auditedCollection.deleteOne({ _id })
    res.status(200).json({
      message: `Vintage deleted. Number of vintages deleted: ${response?.deletedCount}`
    })
  })

const changeStream = db.collection(collection).watch(
  [{ $match: { operationType: 'delete' } }]
)
changeStream.on('change', next => {
  if (next.operationType !== 'delete') return;
  spacesAuditedCollection.deleteMany({ vintageId: next.documentKey._id });
})

router.use(stagesRoutes)

export default router