import {
  Alert,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { CampaignType, CampaignValidationType } from "../../../../../../server/src/types/campaign"
import Vintages from "../../vintages"
import CampaignForm from "../form"

type CampaignTypeForm = Omit<CampaignType, "validation"> & {
  validation: CampaignValidationType | ""
}

export default function Campaign() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState<CampaignTypeForm>({ name: "", validation: "" })
  const queryClient = useQueryClient()

  const { isError, isLoading } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${id}`)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const campaignTmp = await response.json()
      setCampaign(campaignTmp)
      return campaignTmp
    }
  })

  return (
    <>
      {isError && <Alert description="Erreur au chargement de la campagne" variant="error" />}
      {!isError && isLoading && <Text>Chargement de la campagne...</Text>}
      {!isError && !isLoading && (
        <>
          <Title className="fr-my-3w">Campagne</Title>
          <CampaignForm c={campaign} onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", id] }); queryClient.invalidateQueries({ queryKey: ["campaigns"], exact: true }) }}/>
          <Vintages campaignId={id} vintages={campaign?.vintages ?? []} />
        </>
      )}
    </>
  )
}