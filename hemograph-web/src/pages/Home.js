import { Container, Row, Col, Button } from 'react-bootstrap';
import NavigationBar from '../components/Navbar';
import bloodImage from '../assets/images/blood.png';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <NavigationBar />
      <Container className="py-5">
        <Row className="align-items-center min-vh-75">
          <Col xs={12} md={6} className="text-center mb-4 mb-md-0">
            <img 
              src={bloodImage}
              alt="Gota de sangue"
              className="img-fluid blood-image"
            />
          </Col>
          <Col xs={12} md={6} className="text-center text-md-end">
            <h1 className="display-5 fw-bold mb-3 home-title">
              "Doe sangue, espalhe amor,<br/>multiplique vidas."
            </h1>
            <p className="lead fw-bold mb-4 home-text">
              A cada dois segundos, alguém no mundo precisa de uma transfusão de sangue.
              No Brasil, são necessárias cerca de 5.500 doações diárias para atender a
              demanda dos hospitais, mas menos de 2% da população é doadora regular,
              enquanto a Organização Mundial da Saúde (OMS) recomenda pelo menos 3% a
              5%. Uma única doação pode salvar até quatro vidas, tornando esse gesto simples
              um verdadeiro ato de heroísmo.
            </p>
            <div className="text-center text-md-end">
              <Button 
                variant="dark" 
                size="lg" 
                className="donate-button"
                href="/cadastro/doador"
              >
                Seja um doador
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Home; 