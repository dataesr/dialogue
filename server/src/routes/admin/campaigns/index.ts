import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { CampaignlightType, CampaignType } from "../../../types/campaign.ts"
import vintageRoutes from "./vintages/index.ts"

const router = Router()
const collection = "campaigns"
const prefix = `/admin/${collection}`
const auditedCampaigns = auditedCollection(collection)

// /admin/campaigns
router.route(prefix)
  .get(async (_req, res) => {
    const response = await db.collection(collection).aggregate([
      { $match: {} },
      {
        $project: {
          createdAt: 0,
          createdBy: 0,
        }
      },
      {
        $lookup: {
          from: "vintages",
          localField: "_id",
          foreignField: "campaign_id",
          as: "vintages",
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          shortName: 1,
          tagline: 1,
          validation: 1,
          numberOfVintages: { $size: "$vintages" },
        }
      }
    ]).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaignId = new ObjectId()
    const campaign: CampaignType = {
      _id: campaignId,
      name: req.body.name,
      validation: req.body.validation,
    }
    if (req.body?.shortName) campaign.shortName = req.body.shortName
    if (req.body?.tagline) campaign.tagline = req.body.tagline
    const errors: { name?: string, shortName?: string } = {}
    if (campaign.name.length < 2 || campaign.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (campaign?.shortName && (campaign.shortName.length < 2 || campaign.shortName.length > 64)) errors.shortName = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Save campaign into MongoDB
    await auditedCampaigns.insertOne(campaign)

    res.status(201).json({
      message: `Campaign ${campaign.name} added. id: ${campaignId}`,
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
          foreignField: "campaign_id",
          as: "vintages",
        },
      },
    ])
      .toArray()
    if (response.length === 1) return res.status(200).json(response[0])
    res.status(404).json({ message: `No campaign found with id ${_id}` })
  })
  .patch(async (req, res) => {
    const _id = new ObjectId(req.params.campaignId)
    const { _id: _, ...campaign }: CampaignType = req.body
    const errors: { name?: string, shortName?: string } = {}
    if (campaign.name.length < 2 || campaign.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (campaign?.shortName && (campaign.shortName.length < 2 || campaign.shortName.length > 64)) errors.shortName = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Update campaign into MongoDB
    const campaignId = new ObjectId(_id)
    await db.collection(collection).updateOne({ _id: campaignId }, { $set: { ...campaign } })

    res.status(200).json({
      message: `Campaign ${campaign.name} modified. id: ${_id}`,
    })
  })
  // TODO: Delete linked vintages
  .delete(async (req, res) => {
    const _id = new ObjectId(req.params.campaignId)
    await db.collection(collection).deleteOne({ _id })
    res.status(200).json({
      message: `Campaign deleted. id: ${_id}`
    })
  })

router.use(vintageRoutes)

export default router
