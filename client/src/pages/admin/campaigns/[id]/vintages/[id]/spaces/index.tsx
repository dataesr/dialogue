import {
  Button,
  Modal,
  ModalContent,
  ModalTitle,
  Title,
} from "@dataesr/dsfr-plus"
import { useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"

import type { SpaceLight } from "../../../../../../../../../server/src/types/spaces"
import SpaceForm from "./form"

export default function Spaces({ spaces = [] }: { spaces: SpaceLight[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { campaignId, vintageId } = useParams()

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer un espace</ModalTitle>
        <ModalContent>
          <SpaceForm onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId, "vintages", vintageId] }); setIsOpen(false) }} />
        </ModalContent>
      </Modal>
      <Title as="h4">Espaces</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouvel espace
      </Button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>structureId</th>
          </tr>
        </thead>
        <tbody>
          {(spaces ?? []).map((space: SpaceLight) => (
            <tr key={space._id.toString()}>
              <td>{space.structureId.toString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}