import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Spinner, Toast } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import '../styles/CadastroDoador.css';
import { registrarDoador } from '../services/api';

function CadastroDoador() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    tipo_sanguineo: '',
    contato: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    cep: '',
    cidade: '',
    estado: '',
    rua: '',
    numero: '',
    bairro: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const consultaCEP = async (cep) => {
    if (cep.replace(/\D/g, '').length === 8) {
      setIsLoading(true);
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep.replace(/\D/g, '')}/json/`);
        if (!response.data.erro) {
          const novoEndereco = {
            rua: response.data.logradouro,
            bairro: response.data.bairro,
            cidade: response.data.localidade,
            estado: response.data.uf
          };
          
          setFormData(prev => ({
            ...prev,
            ...novoEndereco
          }));
        }
      } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        setToastMessage({
          type: 'danger',
          message: 'Erro ao consultar CEP. Tente novamente.'
        });
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setToastMessage({
        type: 'danger',
        message: 'As senhas não coincidem!'
      });
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    try {
      const dadosCadastro = {
        ...formData,
        contato: formData.contato.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, '')
      };
      
      delete dadosCadastro.confirmarSenha;

      await registrarDoador(dadosCadastro);
      
      setToastMessage({
        type: 'success',
        message: 'Cadastro realizado com sucesso!'
      });
      setShowToast(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setToastMessage({
        type: 'danger',
        message: error.response?.data?.error || error.message || 'Erro ao realizar cadastro. Tente novamente.'
      });
      setShowToast(true);
    } finally {
      setIsLoading(false);
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

        <div style={{
          background: 'linear-gradient(to right, #46052d, #b32346)',
          padding: '40px',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 className="text-white px-3 mb-0">Cadastro de Doador</h2>
        </div>
        
        <div className="form-container">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="nome">
                <Form.Label>Nome completo</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={formData.nome}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="idade">
                <Form.Label>Idade</Form.Label>
                <Form.Control
                  required
                  type="number"
                  placeholder="Sua idade"
                  min="16"
                  max="69"
                  value={formData.idade}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="3" controlId="tipo_sanguineo">
                <Form.Label>Tipo Sanguíneo</Form.Label>
                <Form.Select
                  required
                  value={formData.tipo_sanguineo}
                  onChange={handleInputChange}
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
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="email">
                <Form.Label>E-mail</Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="contato">
                <Form.Label>Contato</Form.Label>
                <InputMask
                  mask="(99) 99999-9999"
                  className="form-control"
                  required
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.contato}
                  onChange={(e) => handleInputChange({
                    target: {
                      id: 'contato',
                      value: e.target.value
                    }
                  })}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="senha">
                <Form.Label>Senha</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Digite sua senha"
                  value={formData.senha}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="confirmarSenha">
                <Form.Label>Confirmar senha</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Confirme sua senha"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="4" controlId="cep">
                <Form.Label>CEP</Form.Label>
                <div className="position-relative">
                  <InputMask
                    mask="99999-999"
                    className="form-control"
                    required
                    type="text"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => handleInputChange({
                      target: {
                        id: 'cep',
                        value: e.target.value
                      }
                    })}
                    onBlur={(e) => consultaCEP(e.target.value)}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div 
                      className="position-absolute"
                      style={{ 
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      <Spinner
                        animation="border"
                        size="sm"
                        variant="secondary"
                      />
                    </div>
                  )}
                </div>
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="cidade">
                <Form.Label>Cidade</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="estado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  required
                  value={formData.estado}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="">Selecione um estado</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="rua">
                <Form.Label>Rua</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Rua"
                  value={formData.rua}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </Form.Group>

              <Form.Group as={Col} md="2" controlId="numero">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Número"
                  value={formData.numero}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Form.Group as={Col} md="4" controlId="bairro">
                <Form.Label>Bairro</Form.Label>
                <Form.Control
                  required
                  type="text"
                  placeholder="Bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
              </Form.Group>
            </Row>

            <div className="d-flex justify-content-end mt-4">
              <Button 
                type="submit"
                variant="dark"
                size="lg"
                className="px-5"
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(0, 0, 0, 0.3)'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    Cadastrar <i className="fas fa-check-circle ms-2"></i>
                  </>
                )}
              </Button>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default CadastroDoador; 