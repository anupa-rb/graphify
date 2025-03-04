import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../styles.css";

function NavBar() {
  return (
    <Navbar expand="lg" style={{ backgroundColor: "#1d5c94" }}>
      <Container>
        <Navbar.Brand style={{ color: "white" }} href="#home">
          Graphify
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="navbar-custom">
          <Nav className="ms-auto">
          <NavDropdown title="Algorithm">
              <NavDropdown.Item href="prims">
                Prim's Algorithm
              </NavDropdown.Item>
              <NavDropdown.Item href="kruskals">
                Kruskal's Algorithm
              </NavDropdown.Item>
              <NavDropdown.Item href="dijkstras">
                Dijkstra's Algorithm
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <Nav.Link href="learnMore">Learn More</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
