import {
  Alert,
  Breadcrumb,
  Link,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { Vintage, VintageStatus } from "../../../../../../../../server/src/types/vintage"
import VintageForm from "../form"
import Spaces from "./spaces"

type VintageForm = Omit<Vintage, "campaignId" | "status"> & {
  status: VintageStatus | ""
}

export default function Vintage() {
  const { campaignId, vintageId } = useParams()
  const [vintage, setVintage] = useState<VintageForm>({ name: "", status: "" })
  const queryClient = useQueryClient()

  const { isError, isLoading } = useQuery({
    queryKey: ["campaigns", campaignId, "vintages", vintageId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${campaignId}/vintages/${vintageId}`)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const _vintage = await response.json()
      setVintage(_vintage)
      return ""
    }
  })

  return (
    <>
      {isError && <Alert description="Erreur au chargement du millésime" variant="error" />}
      {!isError && isLoading && <Text>Chargement du millésime...</Text>}
      {!isError && !isLoading && (
        <>
          <Breadcrumb>
            <Link href="/">Campagnes</Link>
            <Link href={`/campagnes/${campaignId}`}>Campagne {vintage.campaignName}</Link>
            <Link>Millésime {vintage.name}</Link>
          </Breadcrumb>
          <Title className="fr-my-3w">Millésime {vintage.name}</Title>
          <Text className="fr-text-mention--grey" size="xs"><i>Dernière modification le {vintage.modifiedAt} par {vintage.modifiedBy}</i></Text>
          <VintageForm onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId, "vintages", vintageId] }) }} v={vintage} />
          <Spaces spaces={vintage?.spaces ?? []} />
        </>
      )}
    </>
  )
}