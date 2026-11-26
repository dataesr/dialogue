import type { ObjectId } from "mongodb"

export type VintageStatus = "draft" | "test" | "published" | "closed" | "archived"

type AffiliationType = "invitationCode+email" | "email"

export interface Vintage {
  _id: ObjectId
  affiliationType?: AffiliationType
  campaignId: ObjectId
  closesAt?: Date
  description?: string
  modifiedAt: Date
  modifiedBy: string
  name: string
  opensAt?: Date
  publishedAt?: Date
  shortDescription?: string
  status: VintageStatus
}

export type VintageNew = Omit<Vintage, '_id' | 'modifiedBy' | 'modifiedAt'>

export type VintageLight = Omit<Vintage, '_id' | 'campaignId'>