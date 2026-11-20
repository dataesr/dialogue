import { Col, Container, Header, Link, Logo, Nav, Row, Service, Skiplinks } from "@dataesr/dsfr-plus"
import { Outlet, useLocation } from "react-router-dom"

import Footer from "./footer"

const { VITE_MINISTER_NAME } = import.meta.env

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
        <Service name="Dialogue" tagline="#dialogue, l'outil du MESRE pour structurer les échanges et les contributions des acteurs de l'ESR" />
        <Logo text={VITE_MINISTER_NAME} />
        <Nav id="menu">
          <Link current={pathname === "/"} href="/">Campagnes</Link>
          <Link current={pathname === "/users"} href="/users">Utilisateurs</Link>
          <Link current={pathname === "/builder"} href="/builder">SurveyJS</Link>
        </Nav>
      </Header>
      <Container as="main" id="content">
        <Row gutters>
          <Col xs="12" md="7">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  )
}