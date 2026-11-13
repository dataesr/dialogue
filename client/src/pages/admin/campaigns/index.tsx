import { Button, ButtonGroup, Modal, ModalContent, ModalTitle, TextInput, Title } from "@dataesr/dsfr-plus"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import type { CampaignType } from "../../../../../server/src/types/index"

export default function AdminCampaigns() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [name, setName] = useState<string>()
  const [shortName, setShortName] = useState<string>()
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
      status: "test",
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
  }

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer une campagne</ModalTitle>
        <ModalContent>
          <form onSubmit={handleSubmit}>
            <TextInput label="Name" onChange={(e) => { e.preventDefault(); setName(e.target.value) }} value={name} />
            <TextInput label="Short name" onChange={(e) => { e.preventDefault(); setShortName(e.target.value) }} value={shortName} />
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
            <th>_id</th>
            <th>name</th>
            <th>shortName</th>
            <th>status</th>
            <th>type</th>
            <th>validation</th>
          </tr>
        </thead>
        <tbody>
          {(data ?? []).map((campaign: CampaignType) => (
            <tr key={campaign._id}>
              <td>{campaign._id}</td>
              <td>{campaign?.name}</td>
              <td>{campaign?.shortName}</td>
              <td>{campaign?.status}</td>
              <td>{campaign?.type}</td>
              <td>{campaign?.validation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}