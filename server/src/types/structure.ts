import type { ObjectId } from "mongodb"

export interface Structure {
  _id: ObjectId
  name: string
  paysageId: string
  shortName: string
}