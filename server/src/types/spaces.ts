import type { ObjectId } from "mongodb"

type SpaceType = "reponse" | "supervision_s" | "supervision_v"

export interface Space {
  _id: ObjectId
  closedAt?: Date
  closedBy?: string
  // TO QUERY: est-ce un champ libre ou bien est-ce un select parmi une liste de raisons ?
  closureReason?: string
  modifiedAt: Date
  modifiedBy: string
  structureId: ObjectId
  type: SpaceType
  vintageId: ObjectId
}

export type SpaceNew = Omit<Space, "_id" | "modifiedBy" | "modifiedAt">

export type SpaceLight = Omit<Space, "_id">
