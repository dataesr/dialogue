export type CampaignValidationType = "none" | "declarative" | "locking"

export type CampaignType = {
  _id?: any
  name: string // 2 à 255 caractères
  shortName?: string // 2 à 64 caractères
  tagline?: string
  validation: CampaignValidationType
}