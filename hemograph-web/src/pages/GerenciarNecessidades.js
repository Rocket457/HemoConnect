import React, { useState, useEffect } from 'react';
import { Container, Card, Badge, Button, Row, Col, Form, Toast, Modal } from 'react-bootstrap';
import {
  buscarNecessidadesPorBanco,
  criarNecessidadeSangue,
  atualizarNecessidade,
  atualizarStatusNecessidade,
  excluirNecessidade
} from '../services/api';
import NavigationBar from '../components/Navbar';
import '../styles/GerenciarNecessidades.css';

function GerenciarNecessidades() {
  const [necessidades, setNecessidades] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const bancoId = localStorage.getItem('userId');

  const [formData, setFormData] = useState({
    tipo_sanguineo: '',
    nivel_urgencia: '',
    quantidade_necessaria: '',
    data_limite: '',
    observacoes: ''
  });

  const carregarNecessidades = async () => {
    try {
      setIsLoading(true);
      const response = await buscarNecessidadesPorBanco(bancoId);
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
  };

  useEffect(() => {
    carregarNecessidades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        ...formData,
        banco_sangue_id: bancoId
      };

      if (editando) {
        await atualizarNecessidade(editando.id, dados);
        setToastMessage({
          type: 'success',
          message: 'Necessidade atualizada com sucesso!'
        });
      } else {
        await criarNecessidadeSangue(dados);
        setToastMessage({
          type: 'success',
          message: 'Necessidade registrada com sucesso!'
        });
      }

      setShowModal(false);
      carregarNecessidades();
      setShowToast(true);
      limparFormulario();
    } catch (error) {
      setToastMessage({
        type: 'danger',
        message: 'Erro ao salvar necessidade'
      });
      setShowToast(true);
    }
  };

  const handleEdit = (necessidade) => {
    setEditando(necessidade);
    setFormData({
      tipo_sanguineo: necessidade.tipo_sanguineo,
      nivel_urgencia: necessidade.nivel_urgencia,
      quantidade_necessaria: necessidade.quantidade_necessaria,
      data_limite: necessidade.data_limite?.split('T')[0] || '',
      observacoes: necessidade.observacoes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta necessidade?')) {
      try {
        await excluirNecessidade(id);
        setToastMessage({
          type: 'success',
          message: 'Necessidade excluída com sucesso!'
        });
        carregarNecessidades();
        setShowToast(true);
      } catch (error) {
        setToastMessage({
          type: 'danger',
          message: 'Erro ao excluir necessidade'
        });
        setShowToast(true);
      }
    }
  };

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await atualizarStatusNecessidade(id, novoStatus);
      setToastMessage({
        type: 'success',
        message: `Necessidade ${novoStatus ? 'reativada' : 'encerrada'} com sucesso!`
      });
      carregarNecessidades();
      setShowToast(true);
    } catch (error) {
      setToastMessage({
        type: 'danger',
        message: 'Erro ao atualizar status'
      });
      setShowToast(true);
    }
  };

  const limparFormulario = () => {
    setFormData({
      tipo_sanguineo: '',
      nivel_urgencia: '',
      quantidade_necessaria: '',
      data_limite: '',
      observacoes: ''
    });
    setEditando(null);
  };

  const getBadgeVariant = (urgencia) => {
    switch (urgencia) {
      case 'CRITICA': return 'danger';
      case 'ALTA': return 'warning';
      case 'MEDIA': return 'info';
      case 'BAIXA': return 'success';
      default: return 'secondary';
    }
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
          <h2>Gerenciar Necessidades de Sangue</h2>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus me-2"></i>
            Nova Necessidade
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : necessidades.length === 0 ? (
          <div className="text-center">
            <p>Nenhuma necessidade de sangue registrada.</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {necessidades.map((necessidade) => (
              <Col key={necessidade.id}>
                <Card className={`h-100 necessidade-card ${!necessidade.status ? 'inativa' : ''}`}>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <Badge bg={getBadgeVariant(necessidade.nivel_urgencia)}>
                        {necessidade.nivel_urgencia}
                      </Badge>
                      <h3 className="tipo-sanguineo">{necessidade.tipo_sanguineo}</h3>
                    </div>
                    
                    <Card.Text>
                      <strong>Quantidade necessária:</strong> {necessidade.quantidade_necessaria}ml<br />
                      <strong>Data limite:</strong> {necessidade.data_limite ? new Date(necessidade.data_limite).toLocaleDateString('pt-BR') : 'Sem data limite'}<br />
                      {necessidade.observacoes && (
                        <>
                          <strong>Observações:</strong><br />
                          {necessidade.observacoes}
                        </>
                      )}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleEdit(necessidade)}
                      className="flex-grow-1"
                    >
                      <i className="fas fa-edit me-2"></i>
                      Editar
                    </Button>
                    <Button 
                      variant={necessidade.status ? "outline-danger" : "outline-success"}
                      onClick={() => handleStatusChange(necessidade.id, !necessidade.status)}
                    >
                      <i className={`fas fa-${necessidade.status ? 'times' : 'check'}`}></i>
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => handleDelete(necessidade.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal show={showModal} onHide={() => {
          setShowModal(false);
          limparFormulario();
        }}>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>
                {editando ? 'Editar Necessidade' : 'Nova Necessidade'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Tipo Sanguíneo</Form.Label>
                <Form.Select
                  required
                  value={formData.tipo_sanguineo}
                  onChange={(e) => setFormData({...formData, tipo_sanguineo: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nível de Urgência</Form.Label>
                <Form.Select
                  required
                  value={formData.nivel_urgencia}
                  onChange={(e) => setFormData({...formData, nivel_urgencia: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantidade Necessária (ml)</Form.Label>
                <Form.Control
                  type="number"
                  required
                  min="1"
                  value={formData.quantidade_necessaria}
                  onChange={(e) => setFormData({...formData, quantidade_necessaria: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data Limite</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.data_limite}
                  onChange={(e) => setFormData({...formData, data_limite: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Observações</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => {
                setShowModal(false);
                limparFormulario();
              }}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit">
                {editando ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </div>
  );
}

export default GerenciarNecessidades; 