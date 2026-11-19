import type { ObjectId } from "mongodb"

import type { VintageType } from "./vintage.ts"

export type CampaignValidationType = "none" | "declarative" | "locking"

export type CampaignType = {
  _id?: ObjectId
  name: string
  shortName?: string
  tagline?: string
  validation: CampaignValidationType
  vintages?: VintageType[]
}