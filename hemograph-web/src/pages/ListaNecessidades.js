import React, { useState, useEffect, useCallback } from 'react';
import { Container, Card, Badge, Button, Row, Col, Form, Toast, Modal } from 'react-bootstrap';
import { listarNecessidadesSangue, buscarNecessidadesPorTipo } from '../services/api';
import NavigationBar from '../components/Navbar';
import '../styles/ListaNecessidades.css';

function ListaNecessidades() {
  const [necessidades, setNecessidades] = useState([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanco, setSelectedBanco] = useState(null);

  const carregarNecessidades = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = filtroTipo
        ? await buscarNecessidadesPorTipo(filtroTipo)
        : await listarNecessidadesSangue();
      setNecessidades(response.necessidades);
    } catch (error) {
      setToastMessage({
        type: 'danger',
        message: 'Erro ao carregar necessidades de sangue'
      });
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }, [filtroTipo]);

  useEffect(() => {
    carregarNecessidades();
  }, [carregarNecessidades]);

  const getBadgeVariant = (urgencia) => {
    switch (urgencia) {
      case 'CRITICA': return 'danger';
      case 'ALTA': return 'warning';
      case 'MEDIA': return 'info';
      case 'BAIXA': return 'success';
      default: return 'secondary';
    }
  };

  const formatarData = (data) => {
    if (!data) return 'Sem data limite';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const handleVerDados = (necessidade) => {
    setSelectedBanco(necessidade);
    setShowModal(true);
  };

  const getGoogleMapsLink = (banco) => {
    const enderecoFormatado = `${banco.rua}, ${banco.numero}, ${banco.bairro}, ${banco.cidade}, ${banco.estado}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoFormatado)}`;
  };

  const getWhatsAppLink = (banco) => {
    const mensagem = `Olá! Vi sua necessidade de sangue no HemoGraph. Endereço: ${banco.rua}, ${banco.numero}, ${banco.bairro}, ${banco.cidade}, ${banco.estado}. CEP: ${banco.cep}`;
    return `https://wa.me/55${banco.contato.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
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
          <h2>Necessidades de Sangue</h2>
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
        ) : necessidades.length === 0 ? (
          <div className="text-center">
            <p>Nenhuma necessidade de sangue encontrada.</p>
          </div>
        ) : (
          <Row>
            {necessidades.map((necessidade) => (
              <Col xs={12} key={necessidade.id} className="mb-4">
                <Card className="necessidade-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center">
                        <h3 className="tipo-sanguineo me-3">{necessidade.tipo_sanguineo}</h3>
                        <Badge bg={getBadgeVariant(necessidade.nivel_urgencia)} className="me-3">
                          {necessidade.nivel_urgencia}
                        </Badge>
                        <h5 className="mb-0">{necessidade.nome_organizacao}</h5>
                      </div>
                      <Button 
                        variant="outline-primary"
                        onClick={() => handleVerDados(necessidade)}
                      >
                        Ver Dados
                      </Button>
                    </div>
                    <Card.Text>
                      <strong>Localização:</strong> {necessidade.cidade}, {necessidade.estado}<br />
                      <strong>Quantidade necessária:</strong> {necessidade.quantidade_necessaria}ml<br />
                      <strong>Data limite:</strong> {formatarData(necessidade.data_limite)}
                      {necessidade.observacoes && (
                        <div className="mt-2">
                          <strong>Observações:</strong><br />
                          {necessidade.observacoes}
                        </div>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{selectedBanco?.nome_organizacao}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBanco && (
              <>
                <h5>Informações de Contato</h5>
                <p>
                  <strong>Telefone:</strong> {selectedBanco.contato}<br />
                  <strong>Endereço:</strong> {selectedBanco.rua}, {selectedBanco.numero}<br />
                  <strong>Bairro:</strong> {selectedBanco.bairro}<br />
                  <strong>Cidade:</strong> {selectedBanco.cidade}<br />
                  <strong>Estado:</strong> {selectedBanco.estado}<br />
                  <strong>CEP:</strong> {selectedBanco.cep}
                </p>
                <div className="d-flex gap-2">
                  <Button 
                    variant="primary"
                    href={`tel:${selectedBanco.contato}`}
                  >
                    <i className="fas fa-phone me-2"></i>
                    Ligar
                  </Button>
                  <Button 
                    variant="success"
                    href={getWhatsAppLink(selectedBanco)}
                    target="_blank"
                  >
                    <i className="fab fa-whatsapp me-2"></i>
                    WhatsApp
                  </Button>
                  <Button 
                    variant="info"
                    href={getGoogleMapsLink(selectedBanco)}
                    target="_blank"
                  >
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Ver no Maps
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default ListaNecessidades; 