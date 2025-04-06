import { Container, Row, Col } from 'react-bootstrap';
import NavigationBar from '../components/Navbar';
import '../styles/QuemSomos.css';

function QuemSomos() {
  return (
    <div className="quem-somos-container">
      <NavigationBar />
      <Container className="py-5">
        <h1 className="text-center mb-5">Quem Somos</h1>
        
        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="image-container ">
              <img src={require('../assets/images/nossa-equipe.jpeg')} alt="Imagem da equipe" className="section-image" />
            </div>
          </Col>
          <Col md={6}>
            <h2 className="mb-3">Nossa História</h2>
            <p>
              Somos um grupo de estudantes do curso de Biomedicina que, em 2025, uniram forças para criar o Hemoconnect, 
              uma plataforma inovadora que visa transformar o cenário da doação de sangue no Brasil. Nosso projeto nasceu 
              da necessidade de abordar de maneira simples e eficiente, doadores de sangue e hemobancos, facilitando o 
              processo de doação e garantindo uma oferta constante de sangue para aqueles que votarem.
            </p>
          </Col>
        </Row>

        <Row className="mb-5 align-items-center">
          <Col md={6} className="order-md-2 mb-4 mb-md-0">
            <div className="image-container">
              <img src={require('../assets/images/nossa-missao.jpeg')} alt="Imagem representando missão" className="section-image" />
            </div>
          </Col>
          <Col md={6} className="order-md-1">
            <h2 className="mb-3">Nossa Missão</h2>
            <p>
              Nossa missão é descomplicar a doação de sangue e promover a solidariedade, conectando diretamente 
              doadores e hemobancos por meio de uma plataforma digital. Queremos garantir que cada doação de sangue 
              seja realizada com mais facilidade, proporcionando uma experiência intuitiva e humanizada para os doadores 
              e melhorando a gestão dos hemobancos.
            </p>
          </Col>
        </Row>

        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="image-container">
              <img src={require('../assets/images/conexao.png')} alt="Imagem de conexão" className="section-image" />
            </div>
          </Col>
          <Col md={6}>
            <h2 className="mb-3">O que fazemos</h2>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>Conectamos Doadores e Hemobancos:</strong> Por meio de nossa plataforma digital, os doadores 
                podem facilmente localizar hemobancos próximos e agendar a doação no momento mais conveniente para eles.
              </li>
              <li className="mb-3">
                <strong>Facilitamos o Processo:</strong> Simplificamos os requisitos e o processo de doação, tornando-o 
                mais acessível e transparente, para que cada pessoa possa contribuir de forma eficaz.
              </li>
              <li className="mb-3">
                <strong>Valorizamos a Solidariedade:</strong> Nossa plataforma não apenas facilita a doação, mas também 
                conscientiza sobre a importância de manter os hemobancos abastecidos e sobre o impacto social das doações de sangue.
              </li>
            </ul>
          </Col>
        </Row>

        <Row className="mb-5 align-items-center">
          <Col md={6} className="order-md-2 mb-4 mb-md-0">
            <div className="image-container">
              <img src={require('../assets/images/escolha.png')} alt="Imagem de escolha" className="section-image" />
            </div>
          </Col>
          <Col md={6} className="order-md-1">
            <h2 className="mb-3">Por que Escolhemos Criar o Hemoconnect Digital?</h2>
            <p>
              Em um cenário de crescente demanda e dificuldades para manter estoques adequados de sangue, identificamos 
              a necessidade de um sistema mais acessível e eficiente. Queremos contribuir para que a doação de sangue 
              seja uma prática mais comum e fácil, com foco na humanização e sem impacto positivo para a sociedade.
            </p>
          </Col>
        </Row>

        <Row className="mb-5 align-items-center">
          <Col md={6} className="mb-4 mb-md-0">
            <div className="image-container">
              <img src={require('../assets/images/compromisso.png')} alt="Imagem de compromisso" className="section-image" />
            </div>
          </Col>
          <Col md={6}>
            <h2 className="mb-3">Nosso Compromisso</h2>
            <p>
              Estamos comprometidos em transformar a doação de sangue em um hábito social cada vez mais simples e 
              acessível. Nosso objetivo é promover mais ações e salvar vidas de maneira eficiente, garantindo que 
              quem precisa de sangue tenha acesso rápido e seguro.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default QuemSomos; 