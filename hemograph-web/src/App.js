import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CadastroDoador from './pages/CadastroDoador';
import CadastroBanco from './pages/CadastroBanco';
import ListaNecessidades from './pages/ListaNecessidades';
import ListaDoadores from './pages/ListaDoadores';
import GerenciarNecessidades from './pages/GerenciarNecessidades';
import QuemSomos from './pages/QuemSomos';
import RotaPrivadaBanco from './components/RotaPrivadaBanco';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro/doador" element={<CadastroDoador />} />
      <Route path="/cadastro/banco" element={<CadastroBanco />} />
      <Route path="/necessidades" element={<ListaNecessidades />} />
      <Route path="/quem-somos" element={<QuemSomos />} />
      <Route 
        path="/doadores" 
        element={
          <RotaPrivadaBanco>
            <ListaDoadores />
          </RotaPrivadaBanco>
        } 
      />
      <Route 
        path="/gerenciar-necessidades" 
        element={
          <RotaPrivadaBanco>
            <GerenciarNecessidades />
          </RotaPrivadaBanco>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
