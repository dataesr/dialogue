import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { CampaignType } from "../../../types/campaign.ts"
import type { VintageType } from "../../../types/vintage.ts"

const router = Router()
const name = "campaigns"
const auditedCampaigns = auditedCollection(name)
const auditedVintages = auditedCollection("vintages")

// /admin/campaigns
router
  .route(`/${name}`)
  .get(async (_req, res) => {
    const response = await db.collection(name).find().toArray()
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

router.route(`/${name}/:id`)
  .get(async (req, res) => {
    const _id = new ObjectId(req.params.id)
    const response = await db.collection(name).aggregate([
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
    const _id = new ObjectId(req.params.id)
    const { _id: _, ...campaign }: CampaignType = req.body
    const errors: { name?: string, shortName?: string } = {}
    if (campaign.name.length < 2 || campaign.name.length > 255) errors.name = "The campaign name should have 2 to 255 characters"
    if (campaign?.shortName && (campaign.shortName.length < 2 || campaign.shortName.length > 64)) errors.shortName = "The campaign name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Update campaign into MongoDB
    const campaignId = new ObjectId(_id)
    await db.collection(name).updateOne({ _id: campaignId }, { $set: { ...campaign } })

    res.status(200).json({
      message: `Campaign ${campaign.name} modified. id: ${_id}`,
    })
  })

router.route(`/${name}/:id/vintages`)
  .post(async (req, res) => {
    const _id = new ObjectId(req.params.id)
    const vintageId = new ObjectId()
    const vintage: VintageType = {
      _id: vintageId,
      campaign_id: _id,
      name: req.body.name,
      status: req.body.status,
    }
    if (req.body?.closingDate) vintage.closingDate = req.body.closingDate
    if (req.body?.openingDate) vintage.openingDate = req.body.openingDate
    const errors: { name?: string, status?: string } = {}
    if (vintage.name.length < 2 || vintage.name.length > 255) errors.name = "The vintage name should have 2 to 255 characters"
    if (Object.keys(errors).length > 0) return res.status(304).json({ message: Object.values(errors).join(" // ") })

    // Save campaign into MongoDB
    await auditedVintages.insertOne(vintage)

    res.status(201).json({
      message: `Vintage ${vintage.name} added. id: ${vintageId}`,
    })
  })

export default router
