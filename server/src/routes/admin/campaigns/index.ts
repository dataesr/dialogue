import { Router } from "express"
import { ObjectId } from "mongodb"

import { auditedCollection } from "../../../services/auditedCollection.ts"
import { db } from "../../../services/mongo.ts"
import type { CampaignType } from "../../../types/campaign.ts"

const router = Router()
const name = "campaigns"
const auditedCampaigns = auditedCollection(name)

// /admin/campaigns
router
  .route(`/${name}`)
  .get(async (_req, res) => {
    const response = await db.collection(name).find({}).toArray()
    res.json(response)
  })
  .patch(async (req, res) => {
    const { _id, ...campaign }: CampaignType & { _id: ObjectId } = req.body
    const campaignId = new ObjectId(_id)
    await db.collection(name).updateOne({ _id: campaignId }, { $set: { ...campaign } })
    res.status(200).json({
      message: `Campaign ${campaign.name} added. id: ${_id}`,
    })
  })
  .post(async (req, res) => {
    // set defaults for campaign
    const campaignId = new ObjectId()
    const campaign: CampaignType & { _id: ObjectId } = {
      _id: campaignId,
      name: req.body.name,
      validation: req.body.validation,
    }
    // optional fields
    if (req.body?.shortName) campaign.shortName = req.body.shortName
    if (req.body?.tagline) campaign.tagline = req.body.tagline

    // Sauvegarde de la campagne
    await auditedCampaigns.insertOne(campaign)

    res.status(201).json({
      message: `Campaign ${campaign.name} added. id: ${campaignId}`,
    })
  })

router.route(`/${name}/:id`).get(async (req, res) => {
  const id = new ObjectId(req.params.id)
  const response = await db.collection(name).findOne({ _id: id })
  res.json(response)
})

export default router
