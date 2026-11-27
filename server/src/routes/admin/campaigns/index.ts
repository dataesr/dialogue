import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection as audit } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { Campaign, CampaignNew } from "../../../types/campaign.ts"
import vintagesRoutes from "./vintages/index.ts"

const router = Router()
const collection = "campaigns"
const prefix = `/admin/${collection}`
const auditedCollection = audit(collection)
const vintagesCollection = "vintages"
const vintagesAuditedCollection = audit(vintagesCollection)

// /admin/campaigns
router.route(prefix)
  .get(async (_req, res) => {
    const response = await db.collection(collection).aggregate([
      { $match: {} },
      {
        $project: {
          modifiedAt: 0,
          modifiedBy: 0,
        }
      },
      {
        $lookup: {
          from: "vintages",
          localField: "_id",
          foreignField: "campaignId",
          as: "vintages",
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          numberOfVintages: { $size: "$vintages" },
          shortName: 1,
          tagline: 1,
          validation: 1,
        }
      }
    ]).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaign: CampaignNew = {
      name: req.body.name,
      validation: req.body.validation,
    }
    if (req.body?.shortName) campaign.shortName = req.body.shortName
    if (req.body?.tagline) campaign.tagline = req.body.tagline
    const errors: { name?: string, shortName?: string } = {}
    if (campaign.name.length < 2 || campaign.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (campaign?.shortName && (campaign.shortName.length < 2 || campaign.shortName.length > 64)) errors.shortName = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join("\n") })
    const response = await auditedCollection.insertOne(campaign)
    res.status(201).json({
      message: `Campaign ${campaign.name} added. id: ${response?.insertedId}`,
    })
  })

router.route(`${prefix}/:campaignId`)
  .get(async (req, res) => {
    const _id = new ObjectId(req.params.campaignId)
    const response = await db.collection(collection).aggregate([
      { $match: { _id } },
      { $limit: 1 },
      {
        $lookup: {
          from: "vintages",
          localField: "_id",
          foreignField: "campaignId",
          as: "vintages",
          pipeline: [{
            $lookup: {
              from: "spaces",
              localField: "_id",
              foreignField: "vintageId",
              as: "spaces",
            }
          }, {
            $project: {
              _id: 1,
              closesAt: 1,
              name: 1,
              numberOfSpaces: { $size: "$spaces" },
              opensAt: 1,
              status: 1,
            }
          }]
        },
      }
    ]).toArray()
    if (response.length === 1) return res.status(200).json(response[0])
    res.status(404).json({ message: `No campaign found with id ${_id}` })
  })
  .patch(async (req, res) => {
    const _id = new ObjectId(req.params.campaignId)
    const { _id: _, ...campaign }: Campaign = req.body
    const errors: { name?: string, shortName?: string } = {}
    if (campaign.name.length < 2 || campaign.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (campaign?.shortName && (campaign.shortName.length < 2 || campaign.shortName.length > 64)) errors.shortName = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join("\n") })
    const campaignId = new ObjectId(_id)
    const response = await auditedCollection.updateOne({ _id: campaignId }, { $set: { ...campaign } })
    res.status(200).json({
      message: `Campaign ${campaign.name} modified. id: ${response?._id}`,
    })
  })
  .delete(async (req, res) => {
    const _id = new ObjectId(req.params.campaignId)
    const response = await auditedCollection.deleteOne({ _id })
    res.status(200).json({
      message: `Campaign deleted. Number of campaigns deleted: ${response?.deletedCount}`
    })
  })

const changeStream = db.collection(collection).watch(
  [{ $match: { operationType: 'delete' } }]
)
changeStream.on('change', next => {
  if (next.operationType !== 'delete') return;
  vintagesAuditedCollection.deleteMany({ campaignId: next.documentKey._id });
})

router.use(vintagesRoutes)

export default router