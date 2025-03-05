import Button from "react-bootstrap/Button";
import "../styles/landingPage.css";
import Card from "react-bootstrap/Card";

const LandingPage = () => {
  return (
    <div className="pageStyle">
      <div className="containerStyle">
        <h1>GRAPHIFY</h1>
      </div>
      <Button variant="outline-light" size="lg" href="/home" className="btn">
        Start Learning
      </Button>
      <div className="cardStyle">
        <Card.Link href="/prims">
          <Card className="card">
            <Card.Body>
              <Card.Title>
                Prim's
                <br />
                Algorithm
              </Card.Title>
            </Card.Body>
          </Card>
        </Card.Link>
        <Card.Link href="/kruskals">
          <Card className="card">
            <Card.Body>
              <Card.Title>
                Kruskal's
                <br />
                Algorithm
              </Card.Title>
            </Card.Body>
          </Card>
        </Card.Link>
        <Card.Link href="/dijkstras">
          <Card className="card">
            <Card.Body>
              <Card.Title>
                Dijkstra's
                <br />
                Algorithm
              </Card.Title>
            </Card.Body>
          </Card>
        </Card.Link>
      </div>
    </div>
  );
};

export default LandingPage;
