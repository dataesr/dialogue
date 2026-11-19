import {
  Button,
  ButtonGroup,
  Select,
  SelectOption,
  TextInput,
} from "@dataesr/dsfr-plus"
import { useState } from "react"
import { useNavigate } from "react-router"

import type { VintageStatusType, VintageType } from "../../../../../server/src/types/vintage"

type VintageForm = Omit<VintageType, "campaign_id">

const VINTAGE_STATUS = [
  { key: "draft", label: "Brouillon" },
  { key: "test", label: "En test" },
  { key: "published", label: "Publiée" },
  { key: "closed", label: "Fermée" },
  { key: "archived", label: "Archivée" },
]

const defaultVintage: VintageForm = { name: "", status: "draft" }

export default function VintageForm({ onSubmit = () => { }, v }: { onSubmit?: () => void, v?: VintageForm }) {
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [vintage, setVintage] = useState<VintageForm>(v ?? defaultVintage)
    const navigate = useNavigate()

  const resetForm = () => {
    setVintage(defaultVintage)
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorsTmp: { name?: string, status?: string } = {}
    if (!vintage?.name) errorsTmp.name = "Un nom est requis !"
    if (vintage.name && vintage.name.length < 2) errorsTmp.name = "Le nom doit avoir 2 caractères ou plus"
    if (vintage.name && vintage.name.length > 255) errorsTmp.name = "Le nom doit avoir strictement moins de 256 caractères"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch(`/api/admin/vintages${v ? "/" + v._id : ""}`, {
      body: JSON.stringify(vintage),
      headers: {
        "Content-Type": "application/json",
      },
      method: v ? "PATCH" : "POST",
    })
    resetForm()
    onSubmit()
  }

  const handleDelete = async () => {
    if (!v) return
    await fetch(`/api/admin/vintages/${v._id}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
    navigate(-1)
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        hint="2 à 255 caractères"
        label="Nom"
        message={(showErrors && errors?.name) ? <>{errors.name}</> : null}
        messageType={(showErrors && errors?.name) ? "error" : null}
        onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, name: e.target.value }) }}
        required
        value={vintage.name}
      />
      <TextInput
        label="Ouverture"
        onChange={(e) => { e.preventDefault(); console.log(e.target.value); setVintage({ ...vintage, openingDate: e.target.value }) }}
        type="datetime-local"
        value={vintage.openingDate}
      />
      <TextInput
        label="Fermeture"
        onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, closingDate: e.target.value }) }}
        type="datetime-local"
        value={vintage.closingDate}
      />
      <Select
        aria-label="Statut"
        disabledKeys={[""]}
        label="Statut"
        message={(showErrors && errors?.status) ? <>{errors.status}</> : null}
        messageType={(showErrors && errors?.status) ? "error" : null}
        onChange={(e) => setVintage({ ...vintage, status: e as VintageStatusType })}
        value={vintage.status}
      >
        {VINTAGE_STATUS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
      </Select>
      <ButtonGroup isInlineFrom="xs" align="right">
        {v && <Button onClick={() => handleDelete()} color="error">Supprimer</Button>}
        <Button type="submit">Valider</Button>
      </ButtonGroup>
    </form>
  )
}