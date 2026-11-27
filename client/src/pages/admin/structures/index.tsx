import {
  Alert,
  Link,
  Text,
  Title,
} from "@dataesr/dsfr-plus"
import { useQuery } from "@tanstack/react-query"

import type { Structure } from "../../../../../server/src/types/structure"

const { VITE_PAYSAGE_URL } = import.meta.env

export default function Structures() {
  const { data: structures, isError, isLoading } = useQuery<Structure[]>({
    queryKey: ["structures"],
    queryFn: async () => {
      const response = await fetch("/api/admin/structures")
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      return response.json()
    }
  })

  return (
    <>
      <Title className="fr-my-3w">Etablissements</Title>
      {isError && <Alert description="Erreur au chargement des établissements" variant="error" />}
      {!isError && isLoading && <Text>Chargement des établissements...</Text>}
      {!isError && !isLoading && (
        <div className="fr-table" id="table-0-component">
          <div className="fr-table__wrapper">
            <div className="fr-table__container">
              <div className="fr-table__content">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Nom court</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(structures ?? []).map((structure: Structure) => (
                      <tr key={structure._id.toString()}>
                        <td>
                          <Link href={`${VITE_PAYSAGE_URL}/structures/${structure.paysageId}/presentation`} target="_blank">{structure.name}</Link>
                        </td>
                        <td>{structure?.shortName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}