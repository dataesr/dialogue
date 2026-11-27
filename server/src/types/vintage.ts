import type { ObjectId } from "mongodb"
import type { Space } from "./space.ts"

export type VintageStatus = "draft" | "test" | "published" | "closed" | "archived"

type AffiliationType = "invitationCode+email" | "email"

export interface Vintage {
  _id: ObjectId
  affiliationType?: AffiliationType
  campaignId: ObjectId
  campaignName: string
  closesAt?: Date
  description?: string
  modifiedAt: Date
  modifiedBy: string
  name: string
  numberOfSpaces: number
  opensAt?: Date
  publishedAt?: Date
  shortDescription?: string
  spaces: Space[]
  status: VintageStatus
}

export type VintageNew = Omit<Vintage, '_id' | 'numberOfSpaces' | 'modifiedBy' | 'modifiedAt' | 'spaces'>

export type VintageLight = Omit<Vintage, 'campaignId' | 'campaignName' | 'spaces'>