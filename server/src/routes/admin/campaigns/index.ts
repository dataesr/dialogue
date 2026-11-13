import { Router } from "express"

import { db } from "../../../services/mongo.ts"
import type { CampaignType } from "../../../types/index.ts"

const router = Router()
const dbCollection = "campaigns"

// /admin/campaigns
router.route(dbCollection)
  .get(async (_, res) => {
    const response = await db.collection(dbCollection).find({}).toArray()
    res.json(response)
  })
  .post(async (req, res) => {
    const campaign: CampaignType = {
      name: req.body.name,
      shortname: req.body.shortname ?? "",
      status: req.body.status ?? "test",
    }
    if (req.body?.startDate) campaign.startDate = req.body.startDate
    if (req.body?.endDate) campaign.endDate = req.body.endDate
    if (req.body?.type) campaign.type = req.body.type
    if (req.body?.validation) campaign.validation = req.body.validation
    const response = await db.collection(dbCollection).insertOne(campaign)
    res.json({
      message: "Campaign successfully added",
      campaignId: response.insertedId,
    })
  })

export default router