import {
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalTitle,
  Select,
  SelectOption,
  TextInput,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { CampaignType, CampaignValidationType } from "../../../../../../server/src/types/campaign"

const VALIDATIONS = [
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

export default function CampaignsId() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState<CampaignType>({ name: "", validation: "none" })
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)

  const { data } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${id}`)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const campaignTmp = await response.json()
      setCampaign(campaignTmp)
    }
  })

  return (
    <>
      <Title className="fr-my-3w">Campagne {id}</Title>
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
        <ButtonGroup isInlineFrom="xs" align="right">
          <Button type="submit">Modifier</Button>
        </ButtonGroup>
      </form>
    </>
  )
}