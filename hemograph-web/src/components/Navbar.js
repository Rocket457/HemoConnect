import React from 'react';
import { Container, Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import bloodNavbar from '../assets/images/logo.png';
import './Navbar.css';

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('userId');
  const userType = localStorage.getItem('userType');
  
  const isCadastroRoute = location.pathname.startsWith('/cadastro/');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={bloodNavbar}
            alt="Gota de sangue"
            className="img-fluid"
            style={{ 
              maxWidth: '50px',
              filter: 'brightness(2) contrast(1.5) saturate(1.2)'
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-start">
            <NavLink to="/" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'active' : ''}`}>Home</NavLink>
            <NavLink to="/sobre" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'active' : ''}`}>Sobre nós</NavLink>
            {userType === 'doador' && (
              <NavLink to="/necessidades" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'active' : ''}`}>Quero Doar</NavLink>
            )}
            {userType === 'banco' && (
              <>
                <NavLink to="/doadores" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'active' : ''}`}>Encontrar Doadores</NavLink>
                <NavLink to="/gerenciar-necessidades" className={({ isActive }) => `nav-link mx-2 ${isActive ? 'active' : ''}`}>Gerenciar Necessidades</NavLink>
              </>
            )}
            {!isAuthenticated && (
              <Nav.Item className={`dropdown mx-2 ${isCadastroRoute ? 'active' : ''}`}>
                <NavDropdown 
                  title="Cadastre-se" 
                  id="basic-nav-dropdown"
                  className={isCadastroRoute ? 'active' : ''}
                >
                  <NavDropdown.Item as={Link} to="/cadastro/doador">Seja um doador</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/cadastro/banco">Cadastrar banco</NavDropdown.Item>
                </NavDropdown>
              </Nav.Item>
            )}
            {!isAuthenticated ? (
              <Button 
                variant="outline-dark" 
                as={Link} 
                to="/login" 
                className="mx-2 px-4"
                style={{
                  borderRadius: '4px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Entrar
              </Button>
            ) : (
              <Button 
                variant="outline-danger" 
                onClick={handleLogout}
                className="mx-2 px-4"
                style={{
                  borderRadius: '4px',
                  padding: '0.5rem 1.5rem'
                }}
              >
                Sair
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar; 