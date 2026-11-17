import type { ObjectId } from "mongodb"

export type VintageStatusType = "draft" | "test" | "published" | "closed" | "archived"

export type VintageType = {
  _id?: ObjectId
  closingDate?: Date
  name: string
  openingDate?: Date
  status: VintageStatusType
}