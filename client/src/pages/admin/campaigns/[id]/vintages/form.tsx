import {
  Button,
  ButtonGroup,
  Select,
  SelectOption,
  TextInput,
} from "@dataesr/dsfr-plus"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useParams } from "react-router-dom"

import type { Vintage, VintageNew, VintageStatus } from "../../../../../../../server/src/types/vintage"

const VINTAGE_STATUS = [
  { key: "draft", label: "Brouillon" },
  { key: "test", label: "En test" },
  { key: "published", label: "Publiée" },
  { key: "closed", label: "Fermée" },
  { key: "archived", label: "Archivée" },
]

const VINTAGE_STATUS_DISABLED = {
  draft: ["closed", "archived"],
  test: ["closed", "archived"],
  published: ["draft", "test", "archived"],
  closed: ["draft", "test"],
  archived: ["draft", "test", "published"],
}

type VintageForm = Omit<VintageNew, 'campaignId' | 'closesAt' | 'opensAt'> & {
  campaignId: string
  closesAt: string
  opensAt: string
}

export default function VintageForm({ afterSubmit = () => { }, v }: { afterSubmit?: () => void, v?: Vintage }) {
  const navigate = useNavigate()
  const { campaignId } = useParams()
  const defaultVintage: VintageForm = { campaignId: campaignId ?? "", closesAt: new Date().toISOString().slice(0, 16), name: "", opensAt: new Date().toISOString().slice(0, 16), status: "draft" }
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [vintage, setVintage] = useState<VintageForm>(v ?? defaultVintage)

  const resetForm = () => {
    if (!v) setVintage(defaultVintage)
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errorsTmp: { name?: string } = {}
    if (!vintage?.name) errorsTmp.name = "Un nom est requis !"
    if (vintage.name && vintage.name.length < 2) errorsTmp.name = "Le nom doit avoir 2 caractères ou plus"
    if (vintage.name && vintage.name.length > 255) errorsTmp.name = "Le nom doit avoir strictement moins de 256 caractères"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch(`/api/admin/campaigns/${campaignId}/vintages${v ? "/" + v._id : ""}`, {
      body: JSON.stringify(vintage),
      headers: {
        "Content-Type": "application/json",
      },
      method: v ? "PATCH" : "POST",
    })
    resetForm()
    afterSubmit()
  }

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault()
    if (!v) return
    await fetch(`/api/admin/campaigns/${campaignId}/vintages/${v._id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
    navigate(`/campaigns/${campaignId}`)
    afterSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        hint="2 à 255 caractères"
        label="Nom"
        message={(showErrors && errors?.name) ? <>{errors.name}</> : null}
        messageType={(showErrors && errors?.name) ? "error" : null}
        onChange={(event) => { event.preventDefault(); setVintage({ ...vintage, name: event.target.value }) }}
        required
        value={vintage.name}
      />
      <TextInput
        label="Ouverture"
        onChange={(event) => { event.preventDefault(); setVintage({ ...vintage, opensAt: event.target.value }) }}
        type="datetime-local"
        value={(vintage?.opensAt ?? new Date())?.toString() ?? ""}
      />
      <TextInput
        label="Fermeture"
        onChange={(event) => { event.preventDefault(); setVintage({ ...vintage, closesAt: event.target.value }) }}
        type="datetime-local"
        value={(vintage?.closesAt ?? new Date())?.toString() ?? ""}
      />
      <Select
        aria-label="Statut"
        disabledKeys={VINTAGE_STATUS_DISABLED?.[vintage.status] ?? []}
        isRequired
        label="Statut"
        message={(showErrors && errors?.status) ? <>{errors.status}</> : null}
        messageType={(showErrors && errors?.status) ? "error" : null}
        onChange={(event) => setVintage({ ...vintage, status: event as VintageStatus })}
        value={vintage.status}
      >
        {VINTAGE_STATUS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
      </Select>
      <ButtonGroup isInlineFrom="xs" align="right">
        {v && <Button onClick={handleDelete} color="error">Supprimer</Button>}
        <Button type="submit">Valider</Button>
      </ButtonGroup>
    </form>
  )
}