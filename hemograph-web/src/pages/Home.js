import { Container, Row, Col, Button } from 'react-bootstrap';
import NavigationBar from '../components/Navbar';
import bloodImage from '../assets/images/blood.png';

function Home() {
  return (
    <div>
      <NavigationBar />
      <Container className="py-5">
        <Row className="align-items-center min-vh-75">
          <Col md={6}>
            <img 
              src={bloodImage}
              alt="Gota de sangue"
              className="img-fluid"
              style={{ maxWidth: '700px' }}
            />
          </Col>
          <Col md={6}>
            <h1 className="display-5 fw-bold mb-3 text-end">
              "Doe sangue, espalhe amor,<br/>multiplique vidas."
            </h1>
            <p className="lead fw-bold mb-4" style={{ fontSize: '0.7rem' }}>
              A cada dois segundos, alguém no mundo precisa de uma transfusão de sangue.
              No Brasil, são necessárias cerca de 5.500 doações diárias para atender a
              demanda dos hospitais, mas menos de 2% da população é doadora regular,
              enquanto a Organização Mundial da Saúde (OMS) recomenda pelo menos 3% a
              5%. Uma única doação pode salvar até quatro vidas, tornando esse gesto simples
              um verdadeiro ato de heroísmo.
            </p>
            <div className="text-end">
              <Button 
                variant="dark" 
                size="lg" 
                className="px-7 py-3 mt-5"
                style={{ 
                  fontSize: '1.5rem',
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(0, 0, 0, 0.3)',
                  minWidth: '400px',
                  padding: '0.75rem 3rem'
                }}
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