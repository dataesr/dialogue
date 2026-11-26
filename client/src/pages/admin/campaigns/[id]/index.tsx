import {
  Alert,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { Campaign, CampaignValidation } from "../../../../../../server/src/types/campaign"
import CampaignForm from "../form"
import Vintages from "./vintages"

type CampaignForm = Omit<Campaign, "validation"> & {
  validation: CampaignValidation | ""
}

export default function Campaign() {
  const { campaignId } = useParams()
  const [campaign, setCampaign] = useState<CampaignForm>({ name: "", validation: "" })
  const queryClient = useQueryClient()

  const { isError, isLoading } = useQuery({
    queryKey: ["campaigns", campaignId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const _campaign = await response.json()
      setCampaign(_campaign)
      return ""
    }
  })

  return (
    <>
      {isError && <Alert description="Erreur au chargement de la campagne" variant="error" />}
      {!isError && isLoading && <Text>Chargement de la campagne...</Text>}
      {!isError && !isLoading && (
        <>
          <Title className="fr-my-3w">Campagne{campaign && ` ${campaign.name}`}</Title>
          <Text className="fr-text-mention--grey" size="xs"><i>Dernière modification le {campaign.modifiedAt.toString()} par {campaign.modifiedBy}</i></Text>
          <CampaignForm c={campaign} onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] }); queryClient.invalidateQueries({ queryKey: ["campaigns"], exact: true }) }}/>
          <Vintages vintages={campaign?.vintages ?? []} />
        </>
      )}
    </>
  )
}