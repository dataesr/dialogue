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
          { href: "#contenu", label: "Contenu" },
          { href: "#header-navigation", label: "Menu" },
          { href: "#footer", label: "Pied de page" },
        ]}
      />
      <Header>
        <Service name="Dialogue" tagline="#dialogue, l'outil du MESRE pour structurer les échanges et les contributions des acteurs de l'ESR" />
        <Logo text={VITE_MINISTER_NAME} />
        <Nav id="header-navigation">
          <Link current={!pathname.startsWith("/admin")} href="/">Campagnes</Link>
          <Link current={pathname.startsWith("/admin/users")} href="/admin/users">Utilisateurs</Link>
        </Nav>
      </Header>
      <Container as="main" id="contenu">
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