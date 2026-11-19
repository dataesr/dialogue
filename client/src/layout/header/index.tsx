import { Header, Logo, Service } from "@dataesr/dsfr-plus"

const { VITE_MINISTER_NAME } = import.meta.env

export default function LayoutHeader() {
  return (
    <Header>
      <Service name="Dialogue" tagline="#dialogue, l'outil du MESRE pour structurer les échanges et les contributions des acteurs de l'ESR" />
      <Logo text={VITE_MINISTER_NAME} />
    </Header>
  )
}