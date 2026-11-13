import { Header, Logo, Service } from "@dataesr/dsfr-plus";

const { VITE_MINISTER_NAME } = import.meta.env;

export default function LayoutHeader() {
  return (
    <Header>
      <Service name="Dialogue" tagline="#dialogue est l’outil du MESRE d'interaction avec les acteurs du paysage de l’ESR" />
      <Logo text={VITE_MINISTER_NAME} />
    </Header>
  )
}