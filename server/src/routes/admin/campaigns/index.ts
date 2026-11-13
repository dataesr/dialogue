import { Router } from "express"

import { db } from "../../../services/mongo.ts"
import type { CampaignType } from "../../../types/campaign.ts"

const router = Router()
const name = "campaigns"

// /admin/campaigns
router.route(`/${name}`)
  .get(async (_, res) => {
    const response = await db.collection(name).find({}).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaign: CampaignType = {
      name: req.body.name,
      validation: req.body?.validation ?? "none",
    }
    if (req.body?.shortName) campaign.shortName = req.body.shortName
    if (req.body?.tagline) campaign.tagline = req.body.tagline
    const response = await db.collection(name).insertOne(campaign)
    res.json({
      message: "Campaign successfully added",
      campaignId: response.insertedId,
    })
  })

export default router