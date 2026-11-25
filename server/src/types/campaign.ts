import type { ObjectId } from "mongodb";
import type { VintageLightType } from "./vintage.ts";

export type CampaignValidationType = "none" | "declarative" | "locking";

export interface CampaignType {
  _id: ObjectId;
  name: string;
  numberOfVintages: number;
  shortName?: string;
  tagline?: string;
  validation: CampaignValidationType;
  vintages?: VintageLightType[];
  modifiedBy: string;
  modifiedAt: Date;
}

export type CampaignNewType = Omit<CampaignType, "_id" | "modifiedBy" | "modifiedAt">;

export type CampaignlightType = Omit<CampaignType, "_id" | "vintages">;
