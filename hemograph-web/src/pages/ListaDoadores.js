import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Button, Row, Col, Form, Toast } from 'react-bootstrap';
import { listarDoadores, buscarDoadoresPorTipo } from '../services/api';
import NavigationBar from '../components/Navbar';
import '../styles/ListaDoadores.css';

function ListaDoadores() {
  const [doadores, setDoadores] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);

  const carregarDoadores = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = filtroTipo
        ? await buscarDoadoresPorTipo(filtroTipo)
        : await listarDoadores();
      setDoadores(response.doadores);
    } catch (error) {
      setToastMessage({
        type: 'danger',
        message: 'Erro ao carregar lista de doadores'
      });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [filtroTipo]);

  useEffect(() => {
    carregarDoadores();
  }, [carregarDoadores]);

  const formatarData = (data) => {
    if (!data) return 'Nunca doou';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getWhatsAppLink = (doador) => {
    const mensagem = `Olá! Sou do banco de sangue e gostaria de convidá-lo(a) para uma doação.`;
    return `https://wa.me/55${doador.contato.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
  };

  return (
    <div>
      <NavigationBar />
      <Container className="py-5">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          style={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 9999
          }}
          bg={toastMessage.type}
          text={toastMessage.type === 'danger' ? 'white' : 'dark'}
          delay={3000}
          autohide
        >
          <Toast.Body>{toastMessage.message}</Toast.Body>
        </Toast>

        <div className="header-container mb-4">
          <h2>Lista de Doadores</h2>
          <Form.Select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Todos os tipos</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </Form.Select>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : doadores.length === 0 ? (
          <div className="text-center">
            <p>Nenhum doador encontrado.</p>
          </div>
        ) : (
          <Row>
            {doadores.map((doador) => (
              <Col xs={12} key={doador.id} className="mb-4">
                <Card className="doador-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <h3 className="tipo-sanguineo me-3">{doador.tipo_sanguineo}</h3>
                        <h5 className="mb-0">{doador.nome}</h5>
                      </div>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="primary"
                          href={`tel:${doador.contato}`}
                        >
                          <i className="fas fa-phone me-2"></i>
                          Ligar
                        </Button>
                        <Button 
                          variant="success"
                          href={getWhatsAppLink(doador)}
                          target="_blank"
                        >
                          <i className="fab fa-whatsapp me-2"></i>
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                    <Card.Text>
                      <strong>Contato:</strong> {doador.contato}<br />
                      <strong>Localização:</strong> {doador.cidade}, {doador.estado}<br />
                      <strong>Última doação:</strong> {formatarData(doador.ultima_doacao)}
                      {doador.ultimo_banco && (
                        <><br /><strong>Último local de doação:</strong> {doador.ultimo_banco}</>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default ListaDoadores; 