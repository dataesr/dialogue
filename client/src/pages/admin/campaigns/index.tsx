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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import type { CampaignType, CampaignValidationType } from "../../../../../server/src/types/campaign"

const VALIDATIONS = [
  { key: "none", label: "Sans validation" },
  { key: "declarative", label: "Validation déclarative" },
  { key: "locking", label: "Validation bloquante" },
]

export default function AdminCampaigns() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>()
  const [shortName, setShortName] = useState<string>()
  const [tagline, setTagline] = useState<string>()
  const [validation, setValidation] = useState<CampaignValidationType>("none")
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const response = await fetch("/api/admin/campaigns")
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      return response.json()
    },
  })

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newCampaign: CampaignType = {
      name: name ?? "",
      shortName,
      tagline,
      validation: validation ?? "none"
    };
    await fetch("/api/admin/campaigns", {
      body: JSON.stringify(newCampaign),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    queryClient.invalidateQueries({ queryKey: ["campaigns"] })
    setIsOpen(false)
    setName(undefined)
    setShortName(undefined)
    setTagline(undefined)
    setValidation("none")
  }

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer une campagne</ModalTitle>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <TextInput
              hint="2 à 255 caractères"
              label="Nom"
              onChange={(e) => { e.preventDefault(); setName(e.target.value) }}
              value={name}
              required
            />
            <TextInput
              hint="2 à 64 caractères, ex. « EVE »"
              label="Nom court"
              onChange={(e) => { e.preventDefault(); setShortName(e.target.value) }}
              value={shortName}
            />
            <TextInput
              hint="Facultative"
              label="Accroche"
              onChange={(e) => { e.preventDefault(); setTagline(e.target.value) }}
              value={tagline}
            />
            <Select aria-label="Mode de validation" label="Mode de validation" onChange={(e) => setValidation(e.target.value)} value={validation}>
              {VALIDATIONS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
            </Select>
            <ButtonGroup isInlineFrom="xs" align="right">
              <Button type="submit">Valider</Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
      <Title className="fr-my-3w">Campagnes</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouvelle campagne
      </Button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Nom court</th>
            <th>Accroche</th>
            <th>Mode de validation</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((campaign: CampaignType, index: string) => (
            <tr key={`campaign-${index}`}>
              <td>{campaign.name}</td>
              <td>{campaign?.shortName}</td>
              <td>{campaign?.tagline}</td>
              <td>{campaign.validation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}