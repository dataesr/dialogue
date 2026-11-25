import type { ObjectId } from "mongodb"

export type VintageStatusType = "draft" | "test" | "published" | "closed" | "archived"

export type VintageType = {
  _id: ObjectId
  campaign_id: ObjectId
  closingDate?: string
  name: string
  openingDate?: string
  status: VintageStatusType
}

export type VintageNewType = Omit<VintageType, '_id'>

export type VintageLightType = Omit<VintageType, '_id' | 'campaign_id'>