import { Outlet } from "react-router-dom"

import Footer from "./footer"
import Header from "./header"
import { Col, Container, Row } from "@dataesr/dsfr-plus";

export default function Layout() {
  return (
    <>
      <Header />
      <Container>
        <Row gutters>
          <Col xs="12" md="7">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
}