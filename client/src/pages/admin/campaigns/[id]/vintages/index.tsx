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

import type { VintageLight } from "../../../../../../../server/src/types/vintage"
import VintageForm from "./form"

const VINTAGE_STATUS = [
  { key: "draft", label: "Brouillon" },
  { key: "test", label: "En test" },
  { key: "published", label: "Publiée" },
  { key: "closed", label: "Fermée" },
  { key: "archived", label: "Archivée" },
]

export default function Vintages({ vintages = [] }: { vintages: VintageLight[] }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const { campaignId } = useParams()

  return (
    <>
      <Modal isOpen={isOpen} hide={() => setIsOpen(false)}>
        <ModalTitle>Créer un millesime</ModalTitle>
        <ModalContent>
          <VintageForm onSubmit={() => { queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] }); setIsOpen(false) }} />
        </ModalContent>
      </Modal>
      <Title as="h4">Millésimes</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouveau millésime
      </Button>
      <table className="fr-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Ouverture</th>
            <th>Fermeture</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {(vintages ?? []).map((vintage: VintageLight) => (
            <tr key={vintage._id.toString()}>
              <td><a href={`./${campaignId}/millesimes/${vintage._id}`}>{vintage.name}</a></td>
              <td>{vintage.opensAt?.toDateString()}</td>
              <td>{vintage.closesAt?.toDateString()}</td>
              <td>{VINTAGE_STATUS.find((item) => item.key === vintage.status)?.label ?? "Statut inconnu"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}