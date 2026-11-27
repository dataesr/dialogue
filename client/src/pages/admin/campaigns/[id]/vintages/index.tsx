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
          <VintageForm
            afterSubmit={() => {
              queryClient.invalidateQueries({ queryKey: ["campaigns", campaignId] });
              setIsOpen(false);
            }}
          />
        </ModalContent>
      </Modal>
      <Title as="h4">Millésimes</Title>
      <Button
        className="fr-mb-2w"
        onClick={(event) => {
          event.preventDefault();
          setIsOpen(true);
        }}
      >
        Nouveau millésime
      </Button>
      <div className="fr-table" id="table-0-component">
        <div className="fr-table__wrapper">
          <div className="fr-table__container">
            <div className="fr-table__content">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Statut</th>
                    <th>Ouverture</th>
                    <th>Fermeture</th>
                    <th>Espaces</th>
                  </tr>
                </thead>
                <tbody>
                  {(vintages ?? []).map((vintage: VintageLight) => (
                    <tr key={vintage._id.toString()}>
                      <td>
                        <a href={`./${campaignId}/millesimes/${vintage._id}`}>{vintage.name}</a>
                      </td>
                      <td>{VINTAGE_STATUS.find((item) => item.key === vintage.status)?.label ?? "Statut inconnu"}</td>
                      <td>{vintage?.opensAt?.toString()}</td>
                      <td>{vintage?.closesAt?.toString()}</td>
                      <td>{vintage?.numberOfSpaces ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}