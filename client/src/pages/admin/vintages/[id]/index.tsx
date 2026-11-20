import {
  Alert,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { VintageType, VintageStatusType } from "../../../../../../server/src/types/vintage"
import VintageForm from "../form"

type VintageTypeForm = Omit<Omit<VintageType, "campaign_id">, "status"> & {
  status: VintageStatusType | ""
}

export default function Vintage() {
  const { campaignId, vintageId } = useParams()
  const [vintage, setVintage] = useState<VintageTypeForm>({ name: "", status: "" })
  const queryClient = useQueryClient()

  const { isError, isLoading } = useQuery({
    queryKey: ["vintages", vintageId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/vintages/${vintageId}`)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const campaignTmp = await response.json()
      setVintage(campaignTmp)
      return campaignTmp
    }
  })

  return (
    <>
      {isError && <Alert description="Erreur au chargement du millésime" variant="error" />}
      {!isError && isLoading && <Text>Chargement du millésime...</Text>}
      {!isError && !isLoading && (
        <>
          <Title className="fr-my-3w">Millésime</Title>
          <VintageForm onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", id] }) }} v={vintage} />
        </>
      )}
    </>
  )
}