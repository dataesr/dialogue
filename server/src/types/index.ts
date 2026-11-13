export type CampaignType = {
  _id?: string,
  // Libellé long et court,
  name: string, //2 à 255 caractères
  shortName?: string, //2 à 64 caractères, ex. « EVE »
  // dates d'ouverture/fermeture globales (optionnelles — campagne perpétuelle possible) + heures
  startDate?: Date,
  endDate?: Date,
  // Rôles activés par niveau, codes d'invitation globaux
  // Ressources éditoriales, flags (anonyme, participation directe, épingler)
  // Type de campagne : collecte standard, appel à projets, prix/candidature, signalement, initiatives
  type?: "standard" | "call_for_proposals" | "application" | "report" | "initiatives",
  // Champ optionnel periode_observation — distinct du millésime
  // Comportement de validation globale configuré dès la création (Aucune / Déclarative / Verrouillante)
  validation?: "none" | "declarative" | "locking",
  // status (test → publié → (en cours) → fermé → archivé.) default is test
  status: "test" | "published" | "running" | "closed" | "archived"
}