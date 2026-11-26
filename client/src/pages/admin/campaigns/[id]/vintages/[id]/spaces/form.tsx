import {
  Button,
  ButtonGroup,
  TextInput,
} from "@dataesr/dsfr-plus"
import { useState } from "react"
import { useNavigate } from "react-router"
import { useParams } from "react-router-dom"

import type { Space, SpaceNew } from "../../../../../../../../../server/src/types/spaces"

export default function SpaceForm({ onSubmit = () => { }, s }: { onSubmit?: () => void, s?: Space }) {
  const navigate = useNavigate()
  const { campaignId, vintageId } = useParams()
  const defaultSpace: SpaceNew = { structureId: "" }
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [space, setSpace] = useState<SpaceNew>(s ?? defaultSpace)

  const resetForm = () => {
    if (!s) setSpace(defaultSpace)
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
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
    onSubmit()
  }

  const handleDelete = async () => {
    if (!s) return
    await fetch(`/api/admin/campaigns/${campaignId}/vintages/${vintageId}/spaces/${s._id}`, {
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
        label="Structure ID"
        message={(showErrors && errors?.structureId) ? <>{errors.structureId}</> : null}
        messageType={(showErrors && errors?.structureId) ? "error" : null}
        onChange={(e) => { e.preventDefault(); setSpace({ ...space, structureId: e.target.value }) }}
        required
        value={space.structureId}
      />
      <ButtonGroup isInlineFrom="xs" align="right">
        {s && <Button onClick={() => handleDelete()} color="error">Supprimer</Button>}
        <Button type="submit">Valider</Button>
      </ButtonGroup>
    </form>
  )
}