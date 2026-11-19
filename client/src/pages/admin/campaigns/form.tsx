import {
  Button,
  ButtonGroup,
  Select,
  SelectOption,
  TextInput,
} from "@dataesr/dsfr-plus"
import { useState } from "react"

import type { CampaignType, CampaignValidationType } from "../../../../../server/src/types/campaign"

const CAMPAIGN_VALIDATIONS = [
  { key: "", value: "", },
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

type CampaignForm = Omit<CampaignType, "validation"> & {
  validation: CampaignValidationType | "";
}

export default function CampaignForm({ id, onSubmit = () => {} }: { id?: string, onSubmit: () => void }) {
  const [campaign, setCampaign] = useState<CampaignForm>({ name: "", validation: "" })
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)

  const resetForm = () => {
    setCampaign({ name: "", validation: "" })
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorsTmp: { name?: string, shortName?: string, validation?: string } = {}
    if (!campaign.name) errorsTmp.name = "Un nom est requis !"
    if (campaign.name && campaign.name.length < 2) errorsTmp.name = "Le nom doit avoir 2 caractères ou plus"
    if (campaign.name && campaign.name.length > 255) errorsTmp.name = "Le nom doit avoir strictement moins de 256 caractères"
    if (campaign.shortName && campaign.shortName.length < 2) errorsTmp.shortName = "Le nom court doit avoir 2 caractères ou plus"
    if (campaign.shortName && campaign.shortName.length > 64) errorsTmp.shortName = "Le nom doit avoir strictement moins de 65 caractères"
    if (campaign.validation === "") errorsTmp.validation = "Validation ne doit pas être vide"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch(`/api/admin/campaigns${id ? "/" + id : ""}`, {
      body: JSON.stringify(campaign),
      headers: {
        "Content-Type": "application/json",
      },
      method: id ? "PATCH" : "POST",
    })
    resetForm()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        hint="2 à 255 caractères"
        label="Nom"
        message={(showErrors && errors?.name) ? <>{errors.name}</> : null}
        messageType={(showErrors && errors?.name) ? "error" : null}
        onChange={(e) => { e.preventDefault(); setCampaign({ ...campaign, name: e.target.value }) }}
        required
        value={campaign.name}
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
        isRequired
        label="Mode de validation"
        message={(showErrors && errors?.validation) ? <>{errors.validation}</> : null}
        messageType={(showErrors && errors?.validation) ? "error" : null}
        onChange={(e) => setCampaign({ ...campaign, validation: e as CampaignValidationType })}
        value={campaign.validation}
      >
        {CAMPAIGN_VALIDATIONS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
      </Select>
      <ButtonGroup isInlineFrom="xs" align="right">
        <Button type="submit">Valider</Button>
      </ButtonGroup>
    </form>
  )
}