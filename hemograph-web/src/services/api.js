import axios from 'axios';

const api = axios.create({
  baseURL:  process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
      'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (dados) => {
  try {
    const response = await api.post('/auth/login', dados);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const registrarBancoSangue = async (dados) => {
  try {
    const response = await api.post('/bancos/registro', dados);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const registrarDoador = async (dados) => {
  try {
    const response = await api.post('/doadores/registro', dados);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// Serviços para Necessidades de Sangue
export const criarNecessidadeSangue = async (dados) => {
  try {
    const response = await api.post('/necessidades-sangue/registro', dados);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const listarNecessidadesSangue = async () => {
  try {
    const response = await api.get('/necessidades-sangue');
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const buscarNecessidadesPorTipo = async (tipoSanguineo) => {
  try {
    const response = await api.get(`/necessidades-sangue/tipo/${tipoSanguineo}`);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const buscarNecessidadesPorBanco = async (bancoId) => {
  try {
    const response = await api.get(`/necessidades-sangue/banco/${bancoId}`);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const atualizarStatusNecessidade = async (id, status) => {
  try {
    const response = await api.patch(`/necessidades-sangue/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const atualizarNecessidade = async (id, dados) => {
  try {
    const response = await api.put(`/necessidades-sangue/${id}`, dados);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const excluirNecessidade = async (id) => {
  try {
    const response = await api.delete(`/necessidades-sangue/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// Serviços para Doadores
export const listarDoadores = async () => {
  try {
    const response = await api.get('/doadores/listar');
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const buscarDoadoresPorTipo = async (tipoSanguineo) => {
  try {
    const response = await api.get(`/doadores/tipo/${tipoSanguineo}`);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export const buscarDoadoresPorLocalizacao = async (cidade, estado) => {
  try {
    const params = new URLSearchParams();
    if (cidade) params.append('cidade', cidade);
    if (estado) params.append('estado', estado);
    
    const response = await api.get(`/doadores/busca/localizacao?${params}`);
    return response.data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

export default api; 