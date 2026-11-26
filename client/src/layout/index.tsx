import { Col, Container, Footer, Header, Link, Logo, Nav, Row, Service, Skiplinks } from "@dataesr/dsfr-plus"
import { Outlet, useLocation } from "react-router-dom"

const { VITE_MINISTER_NAME, VITE_VERSION } = import.meta.env

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <Skiplinks
        links={[
          { href: "#menu", label: "Menu" },
          { href: "#content", label: "Contenu" },
          { href: "#footer", label: "Pied de page" },
        ]}
      />
      <Header>
        <Service name="Dialogue" tagline="#dialogue, l'outil du MESRE pour structurer les échanges et les interactions des acteurs de l'ESR" />
        <Logo text={VITE_MINISTER_NAME} />
        <Nav id="menu">
          <Link current={pathname === "/"} href="/">Campagnes</Link>
          <Link current={pathname === "/utilisateurs"} href="/utilisateurs">Utilisateurs</Link>
          <Link current={pathname === "/formulaire"} href="/formulaire">Formulaire</Link>
        </Nav>
      </Header>
      <Container as="main" id="content">
        <Row gutters>
          <Col xs="12" md="7">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer
        brand={VITE_MINISTER_NAME}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris."
        id="footer"
      >
        <Link href="#">Plan du site</Link>
        <Link href="#">Accessibilité : non/partiellement/totalement conforme</Link>
        <Link href="#">Mentions légales</Link>
        <Link href="#">Données personnelles</Link>
        <Link href="#">Gestion des cookies</Link>
        <Link
          href={`https://github.com/dataesr/dialogue/releases/tag/${VITE_VERSION}`}
          rel="noreferrer noopener external"
          target="_blank"
          title={`v${VITE_VERSION} - nouvelle fenêtre`}
        >
          {`v${VITE_VERSION}`}
        </Link>
      </Footer>
    </>
  )
}