import {
  Button,
  ButtonGroup,
  Select,
  SelectOption,
  TextInput,
} from "@dataesr/dsfr-plus"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { Space, SpaceNew, SpaceType } from "../../../../../../../../../server/src/types/space"

const SPACE_TYPE = [
  { key: "reponse", label: "Répondant" },
  { key: "supervision_s", label: "Superviseur de niveau 1" },
  { key: "supervision_v", label: "Superviseur de niveau 2" },
  { key: "admin", label: "Administrateur" },
]

type SpaceForm = Omit<SpaceNew, 'closedAt' | 'vintageId'> & {
  closedAt: string
  vintageId: string
}

export default function SpaceForm({ afterSubmit = () => { }, s }: { afterSubmit?: () => void, s?: Space }) {
  const { campaignId, vintageId } = useParams()
  const defaultSpace: SpaceForm = { closedAt: new Date().toISOString().slice(0, 16), structureId: "", type: "reponse", vintageId: vintageId ?? "" }
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [space, setSpace] = useState<SpaceForm>(s ? s : defaultSpace)

  const resetForm = () => {
    if (!s) setSpace(defaultSpace)
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const errorsTmp: { structureId?: string } = {}
    if (!space?.structureId) errorsTmp.structureId = "Une structure est requise !"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch(`/api/admin/campaigns/${campaignId}/vintages/${vintageId}/spaces${s ? "/" + s._id : ""}`, {
      body: JSON.stringify(space),
      headers: {
        "Content-Type": "application/json",
      },
      method: s ? "PATCH" : "POST",
    })
    resetForm()
    afterSubmit()
  }

  return (
    <form onSubmit={handleSubmit}>
      <Select
        aria-label="Type"
        isRequired
        label="Type"
        message={(showErrors && errors?.type) ? <>{errors.type}</> : null}
        messageType={(showErrors && errors?.type) ? "error" : null}
        onChange={(event) => setSpace({ ...space, type: event as SpaceType })}
        value={space.type}
      >
        {SPACE_TYPE.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
      </Select>
      <TextInput
        hint="2 à 255 caractères"
        label="Structure ID"
        message={(showErrors && errors?.structureId) ? <>{errors.structureId}</> : null}
        messageType={(showErrors && errors?.structureId) ? "error" : null}
        onChange={(event) => { event.preventDefault(); setSpace({ ...space, structureId: event.target.value }) }}
        required
        value={space.structureId}
      />
      <TextInput
        label="Fermeture"
        onChange={(event) => { event.preventDefault(); setSpace({ ...space, closedAt: event.target.value }) }}
        type="datetime-local"
        value={(space?.closedAt ?? new Date())?.toString() ?? ""}
      />
      <ButtonGroup isInlineFrom="xs" align="right">
        <Button type="submit">Valider</Button>
      </ButtonGroup>
    </form>
  )
}