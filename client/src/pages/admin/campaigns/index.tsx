import {
  Alert,
  Button,
  Modal,
  ModalContent,
  ModalTitle,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import type { Campaign, CampaignValidation } from "../../../../../server/src/types/campaign"
import CampaignForm from "./form"

const CAMPAIGN_VALIDATIONS = [
  { key: "", value: "", },
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

type CampaignForm = Omit<Campaign, "validation"> & {
  validation: CampaignValidation | ""
}

export default function Campaigns() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { data: campaigns, isError, isLoading } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/admin/campaigns")
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      return response.json()
    }
  })

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer une campagne</ModalTitle>
        <ModalContent>
          <CampaignForm onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns"] }); setIsOpen(false) }} />
        </ModalContent>
      </Modal>
      <Title className="fr-my-3w">Campagnes</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouvelle campagne
      </Button>
      {isError && <Alert description="Erreur au chargement des campagnes" variant="error" />}
      {!isError && isLoading && <Text>Chargement des campagnes...</Text>}
      {!isError && !isLoading && (
        <table className="fr-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Nom court</th>
              <th>Accroche</th>
              <th>Mode de validation</th>
              <th>Nombre de millésimes</th>
            </tr>
          </thead>
          <tbody>
            {(campaigns ?? []).map((campaign: Campaign) => (
              <tr key={campaign._id.toString()}>
                <td><a href={`./campagnes/${campaign._id}`}>{campaign.name}</a></td>
                <td>{campaign?.shortName}</td>
                <td>{campaign?.tagline}</td>
                <td>{CAMPAIGN_VALIDATIONS.find((item) => item.key === campaign.validation)?.label ?? "Mode de validation inconnu"}</td>
                <td>{campaign?.numberOfVintages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}