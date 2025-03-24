import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Toast, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/Navbar';
import '../styles/Login.css';
import { login } from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
    tipo: 'doador'
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const showToastMessage = (type, message) => {
    setToastMessage({ type, message });
    setShowToast(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({
        email: formData.email,
        senha: formData.senha,
        tipo: formData.tipo
      });

      localStorage.setItem('userId', response.usuario.id);
      localStorage.setItem('userType', response.tipo);

      setToastMessage({
        type: 'success',
        message: 'Login realizado com sucesso!'
      });
      setShowToast(true);

      // Redirecionar após 1 segundo
      setTimeout(() => {
        if (response.tipo === 'banco') {
          navigate('/gerenciar-necessidades');
        } else {
          navigate('/necessidades');
        }
      }, 1000);
    } catch (error) {
      setToastMessage({
        type: 'danger',
        message: error.response?.data?.error || 'Erro ao realizar login'
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

        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="login-container">
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: '#46052d' }}>Login</h2>
                <p className="text-muted">Faça login para continuar</p>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="email">
                  <div className="input-group">
                    <div className="input-group-text bg-white border-end-0">
                      <i className="fas fa-user" style={{ color: '#46052d' }}></i>
                    </div>
                    <Form.Control
                      type="email"
                      placeholder="Digite seu e-mail"
                      className="border-start-0"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="senha">
                  <div className="input-group">
                    <div className="input-group-text bg-white border-end-0">
                      <i className="fas fa-key" style={{ color: '#46052d' }}></i>
                    </div>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className="border-start-0 border-end-0"
                      value={formData.senha}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                    <div 
                      className="input-group-text bg-white border-start-0 cursor-pointer"
                      onClick={() => !isLoading && setShowPassword(!showPassword)}
                      style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye' : 'fa-eye-slash'}`} style={{ color: '#46052d' }}></i>
                    </div>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="tipo">
                  <Form.Select
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="border-0 shadow-sm"
                    disabled={isLoading}
                  >
                    <option value="doador">Doador</option>
                    <option value="banco">Banco de Sangue</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit"
                    variant="dark"
                    size="lg"
                    className="py-3"
                    style={{
                      background: 'linear-gradient(to right, #46052d, #b32346)',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
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
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Não tem uma conta?{' '}
                    <Button
                      variant="link"
                      className="p-0"
                      style={{ color: '#46052d', textDecoration: 'none' }}
                      onClick={() => navigate('/cadastro/doador')}
                      disabled={isLoading}
                    >
                      Cadastre-se
                    </Button>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Login; 