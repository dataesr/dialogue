import { Router } from "express"
import { ObjectId } from "mongodb"

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

router.route(`/${name}/:id`)
  .get(async (req, res) => {
    const id = new ObjectId(req.params.id);
    const response = await db.collection(name).findOne({ _id: id })
    res.json(response)
  })

export default router