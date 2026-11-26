import {
  Alert,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { CampaignLight, CampaignValidation } from "../../../../../../server/src/types/campaign"
import Vintages from "./vintages"
import CampaignForm from "../form"

type CampaignTypeForm = Omit<Omit<CampaignLight, "validation">, "_id"> & {
  validation: CampaignValidation | ""
}

export default function Campaign() {
  const { campaignId } = useParams()
  const [campaign, setCampaign] = useState<CampaignTypeForm>({ name: "", validation: "" })
  const queryClient = useQueryClient()

  const { isError, isLoading } = useQuery({
    queryKey: ["campaigns", campaignId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}`)
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
          <CampaignForm c={campaign} onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] }); queryClient.invalidateQueries({ queryKey: ["campaigns"], exact: true }) }}/>
          <Vintages campaignId={campaignId} vintages={campaign?.vintages ?? []} />
        </>
      )}
    </>
  )
}