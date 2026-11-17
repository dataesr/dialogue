import { Title } from "@dataesr/dsfr-plus"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export default function CampaignsId() {
  const { id } = useParams()

  const { data } = useQuery({
    queryKey: ["campaigns", id],
    queryFn: async () => {
      const response = await fetch(`/api/admin/campaigns/${id}`)
      console.log(response)
      if (!response.ok) throw new Error(`Erreur ${response.status}`)
      const j = await response.json()
      console.log(j)
      return j
    }
  })

  return (
    <>
      <Title className="fr-my-3w">Campagne {id}</Title>
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
            <tr>
              <td>{data?.name}</td>
              <td>{data?.shortName}</td>
              <td>{data?.tagline}</td>
              <td>{data?.validation}</td>
            </tr>
        </tbody>
      </table>
    </>
  )
}