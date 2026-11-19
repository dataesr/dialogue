import {
  Alert,
  Button,
  ButtonGroup,
  Modal,
  ModalContent,
  ModalTitle,
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
import type { VintageType, VintageStatusType } from "../../../../../../server/src/types/vintage"
import CampaignForm from "../form"

const CAMPAIGN_VALIDATIONS = [
  { key: "", value: "", },
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

const VINTAGE_STATUS = [
  { key: "draft", label: "Brouillon" },
  { key: "test", label: "En test" },
  { key: "published", label: "Publiée" },
  { key: "closed", label: "Fermée" },
  { key: "archived", label: "Archivée" },
]

type CampaignTypeForm = Omit<CampaignType, "validation"> & {
  validation: CampaignValidationType | ""
}
type VintageForm = Omit<VintageType, "campaign_id">

export default function CampaignsId() {
  const { id } = useParams()
  const [campaign, setCampaign] = useState<CampaignTypeForm>({ name: "", validation: "" })
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const [vintage, setVintage] = useState<VintageForm>({ name: "", status: "draft" })
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
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmitCampaign = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    await fetch(`/api/admin/campaigns/${id}`, {
      body: JSON.stringify(campaign),
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
    })
    queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    closeAndResetForm()
  }

  const handleSubmitVintage = async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    await fetch(`/api/admin/campaign/${id}/vintages`, {
      body: JSON.stringify(vintage),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
    queryClient.invalidateQueries({ queryKey: ["vintages"] })
    closeAndResetForm()
  }

  return (
    <>
      {isError && <Alert description="Erreur au chargement de la campagne" variant="error" />}
      {!isError && isLoading && <Text>Chargement de la campagne...</Text>}
      {!isError && !isLoading && (
        <>
          <Modal isOpen={isOpen} hide={() => closeAndResetForm()}>
            <ModalTitle>Créer un millesime</ModalTitle>
            <ModalContent>
              <form onSubmit={handleSubmitVintage}>
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
                  onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, closingDate: new Date(e.target.value) }) }}
                  type="datetime-local"
                  value={vintage.openingDate?.toString()}
                />
                <TextInput
                  label="Fermeture"
                  onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, closingDate: new Date(e.target.value) }) }}
                  type="datetime-local"
                  value={vintage.closingDate?.toString()}
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
                  <Button type="submit">Valider</Button>
                </ButtonGroup>
              </form>
            </ModalContent>
          </Modal>
          <Title className="fr-my-3w">Campagne "{campaign.name}"</Title>
          <CampaignForm id={id} />
          <Title as="h4">Millésimes</Title>
          <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
            Nouveau millésime
          </Button>
          <table className="fr-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Statut</th>
                <th>Ouverture</th>
                <th>Fermeture</th>
              </tr>
            </thead>
            <tbody>
              {(campaign?.vintages ?? []).map((vintage: VintageType, index: number) => (
                <tr key={`vintage-${index}`}>
                  <td><a href={`./vintages/${vintage._id}`}>{vintage.name}</a></td>
                  <td>{VINTAGE_STATUS.find((item) => item.key === vintage.status)?.label ?? "Statut inconnu"}</td>
                  <td>{vintage.openingDate?.toString()}</td>
                  <td>{vintage.closingDate?.toJSON()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  )
}