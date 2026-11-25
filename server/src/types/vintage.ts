import type { ObjectId } from "mongodb"

type VintageStatusType = "draft" | "test" | "published" | "closed" | "archived";

type affiliationTypeType = "invitationCode+email" | "email";

export interface VintageType {
  _id: ObjectId;
  campaign_id: ObjectId;
  opensAt?: Date;
  publishedAt?: Date;
  closesAt?: Date;
  name: string;
  status: VintageStatusType;
  description?: string;
  shortDescription?: string;
  affiliationType?: affiliationTypeType;
  modifiedBy: string;
  modifiedAt: Date;
}

export type VintageNewType = Omit<VintageType, "_id" | "modifiedBy" | "modifiedAt">;

export type VintageLightType = Omit<VintageType, '_id' | 'campaign_id'>