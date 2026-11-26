import type { ObjectId } from "mongodb"

import type { VintageLight } from "./vintage.ts"

export type CampaignValidation = "none" | "declarative" | "locking"

export interface Campaign {
  _id: ObjectId
  modifiedAt: Date
  modifiedBy: string
  name: string
  numberOfVintages: number
  shortName?: string
  tagline?: string
  validation: CampaignValidation
  vintages: VintageLight[]
}

export type CampaignNew = Omit<Campaign, '_id' | 'numberOfVintages' | 'modifiedBy' | 'modifiedAt' | 'vintages'>

export type CampaignLight = Omit<Campaign, 'vintages'>