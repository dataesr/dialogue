import { Col, Container, Header, Link, Logo, Nav, Row, Service } from "@dataesr/dsfr-plus"
import { Outlet, useLocation } from "react-router-dom"

import Footer from "./footer"

const { VITE_MINISTER_NAME } = import.meta.env

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <>
      <Header>
        <Service name="Dialogue" tagline="#dialogue, l'outil du MESRE pour structurer les échanges et les contributions des acteurs de l'ESR" />
        <Logo text={VITE_MINISTER_NAME} />
        <Nav>
          <Link current={!pathname.startsWith("/admin")} href="/">Campagnes</Link>
          <Link current={pathname.startsWith("/admin/users")} href="/admin/users">Utilisateurs</Link>
        </Nav>
      </Header>
      <Container>
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