import {
  Alert,
  Button,
  ButtonGroup,
  Select,
  SelectOption,
  Text,
  TextInput,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { CampaignType, CampaignValidationType } from "../../../../../../server/src/types/campaign"

const VALIDATIONS = [
  { key: "", value: "", },
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

type CampaignTypeForm = Omit<CampaignType, "validation"> & {
  validation: CampaignValidationType | "";
}

export default function CampaignsId() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState<CampaignTypeForm>({ name: "", validation: "" })
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
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

  const closeAndResetForm = () => {
    setCampaign({ name: "", validation: "" })
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorsTmp: { name?: string, shortName?: string, validation?: string } = {}
    if (!campaign.name) errorsTmp.name = "Un nom est requis !"
    if (campaign.name && campaign.name.length < 2) errorsTmp.name = "Le nom doit avoir plus de 2 caractères"
    if (campaign.name && campaign.name.length > 255) errorsTmp.name = "Le nom doit avoir moins de 255 caractères"
    if (campaign.shortName && campaign.shortName.length < 2) errorsTmp.shortName = "Le nom court doit avoir plus de 2 caractères"
    if (campaign.shortName && campaign.shortName.length > 255) errorsTmp.shortName = "Le nom court doit avoir moins de 255 caractères"
    if (campaign.validation === "") errorsTmp.validation = "Validation ne doit pas être vide"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch("/api/admin/campaigns", {
      body: JSON.stringify(campaign),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    closeAndResetForm()
  }

  return (
    <>
      {isError && <Alert description="Erreur au chargement des campagnes" variant="error" />}
      {!isError && isLoading && <Text>Chargement des campagnes...</Text>}
      {!isError && !isLoading && (
        <>
          <Title className="fr-my-3w">Campagne "{campaign.name}"</Title>
          <form onSubmit={handleSubmit}>
            <TextInput
              hint="2 à 255 caractères"
              label="Nom"
              message={(showErrors && errors?.name) ? <>{errors.name}</> : null}
              messageType={(showErrors && errors?.name) ? "error" : null}
              onChange={(e) => { e.preventDefault(); setCampaign({ ...campaign, name: e.target.value }) }}
              required
              value={campaign.name}
              isOptional
            />
            <TextInput
              hint="2 à 64 caractères, ex. « EVE »"
              label="Nom court"
              message={(showErrors && errors?.shortName) ? <>{errors.shortName}</> : null}
              messageType={(showErrors && errors?.shortName) ? "error" : null}
              onChange={(e) => { e.preventDefault(); setCampaign({ ...campaign, shortName: e.target.value }) }}
              value={campaign.shortName}
            />
            <TextInput
              hint="Facultative"
              label="Accroche"
              message={(showErrors && errors?.tagline) ? <>{errors.tagline}</> : null}
              messageType={(showErrors && errors?.tagline) ? "error" : null}
              onChange={(e) => { e.preventDefault(); setCampaign({ ...campaign, tagline: e.target.value }) }}
              value={campaign.tagline}
            />
            <Select
              aria-label="Mode de validation"
              disabledKeys={[""]}
              label="Mode de validation"
              onChange={(e) => setCampaign({ ...campaign, validation: e as CampaignValidationType })}
              value={campaign.validation}
              isRequired
            >
              {VALIDATIONS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
            </Select>
            <>
              {/* See issue https://github.com/dataesr/dsfr-plus/issues/35 */}
              {showErrors && errors?.validation && <Alert description={`${errors.validation}`} variant="error" />}
            </>
            <ButtonGroup isInlineFrom="xs" align="right">
              <Button type="submit">Modifier</Button>
            </ButtonGroup>
          </form>
        </>
      )}
    </>
  )
}