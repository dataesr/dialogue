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

import type { VintageType, VintageStatusType } from "../../../../../server/src/types/vintage"

const STATUS = [
  { key: "", value: "", },
  { key: "draft", label: "Brouillon" },
  { key: "test", label: "En test" },
  { key: "published", label: "Publiée" },
  { key: "closed", label: "Fermée" },
  { key: "archived", label: "Archivée" },
]

type VintageForm = Omit<VintageType, "status"> & {
  status: VintageStatusType | "";
}

export default function Vintages() {
  const [vintage, setVintage] = useState<VintageForm>({ name: "", status: "" })
  const [errors, setErrors] = useState<{ [key: string]: unknown }>({})
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showErrors, setShowErrors] = useState<boolean>(false)
  const queryClient = useQueryClient()

  const { data: vintages, isError, isLoading } = useQuery<VintageType[]>({
    queryKey: ["vintages"],
    queryFn: async () => {
      const response = await fetch("/api/admin/vintages")
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      return response.json()
    }
  })

  const closeAndResetForm = () => {
    setIsOpen(false)
    setVintage({ name: "", status: "" })
    setErrors({})
    setShowErrors(false)
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errorsTmp: { name?: string, shortName?: string, validation?: string } = {}
    if (!vintage.name) errorsTmp.name = "Un nom est requis !"
    if (vintage.name && vintage.name.length < 2) errorsTmp.name = "Le nom doit avoir plus de 2 caractères"
    if (vintage.name && vintage.name.length > 255) errorsTmp.name = "Le nom doit avoir moins de 255 caractères"
    // if (vintage.shortName && vintage.shortName.length < 2) errorsTmp.shortName = "Le nom court doit avoir plus de 2 caractères"
    // if (vintage.shortName && vintage.shortName.length > 255) errorsTmp.shortName = "Le nom court doit avoir moins de 255 caractères"
    if (vintage.status === "") errorsTmp.validation = "Status ne doit pas être vide"
    if (Object.keys(errorsTmp).length > 0) {
      setErrors(errorsTmp)
      setShowErrors(true)
      return
    }
    await fetch("/api/admin/vintages", {
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
      <Modal isOpen={isOpen} hide={() => closeAndResetForm()}>
        <ModalTitle>Créer un millesime</ModalTitle>
        <ModalContent>
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
            {/* <TextInput
              hint="2 à 64 caractères, ex. « EVE »"
              label="Nom court"
              message={(showErrors && errors?.shortName) ? <>{errors.shortName}</> : null}
              messageType={(showErrors && errors?.shortName) ? "error" : null}
              onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, shortName: e.target.value }) }}
              value={vintage.shortName}
            />
            <TextInput
              hint="Facultative"
              label="Accroche"
              message={(showErrors && errors?.tagline) ? <>{errors.tagline}</> : null}
              messageType={(showErrors && errors?.tagline) ? "error" : null}
              onChange={(e) => { e.preventDefault(); setVintage({ ...vintage, tagline: e.target.value }) }}
              value={vintage.tagline}
            /> */}
            <Select
              aria-label="Statut"
              disabledKeys={[""]}
              label="Statut"
              onChange={(e) => setVintage({ ...vintage, status: e as VintageStatusType })}
              value={vintage.status}
              isRequired
            >
              {STATUS.map(({ key, label }) => <SelectOption key={key}>{label}</SelectOption>)}
            </Select>
            <>
              {/* See issue https://github.com/dataesr/dsfr-plus/issues/35 */}
              {showErrors && errors?.validation && <Alert description={`${errors.validation}`} variant="error" />}
            </>
            <ButtonGroup isInlineFrom="xs" align="right">
              <Button type="submit">Valider</Button>
            </ButtonGroup>
          </form>
        </ModalContent>
      </Modal>
      <Title className="fr-my-3w">Millésimes</Title>
      <Button className="fr-mb-2w" onClick={(e) => { e.preventDefault(); setIsOpen(true) }}>
        Nouveau millésime
      </Button>
      {isError && <Alert description="Erreur au chargement des millésimes" variant="error" />}
      {!isError && isLoading && <Text>Chargement des millésimes...</Text>}
      {!isError && !isLoading && (
        <table className="fr-table">
          <thead>
            <tr>
              <th>Nom</th>
              {/* <th>Nom court</th>
              <th>Accroche</th> */}
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {(vintages ?? []).map((vintage: VintageType, index: number) => (
              <tr key={`vintage-${index}`}>
                <td><a href={`./vintages/${vintage._id}`}>{vintage.name}</a></td>
                {/* <td>{vintage?.shortName}</td>
                <td>{vintage?.tagline}</td> */}
                <td>{vintage.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}