const express = require('express');
const cors = require('cors');
const swagger = require('./swagger');
const authRoutes = require('./routes/auth');
const doadoresRoutes = require('./routes/doadores');
const bancosSangueRoutes = require('./routes/bancoSangue');
const doacoesRoutes = require('./routes/doacoes');
const necessidadesSangueRoutes = require('./routes/necessidadesSangue');

const app = express();

// Configuração do CORS
const corsOptions = {
  origin: [
    'https://hemoconnectbackend.vercel.app/',
    'https://hemoconnectbackend.vercel.app/api-docs',
    'https://hemo-connect-qgu8-git-main-rocket457s-projects.vercel.app',
    'https://hemo-connect.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 horas
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Configuração do Swagger
swagger(app);

// Rotas da API
app.use('/auth', authRoutes);
app.use('/doadores', doadoresRoutes);
app.use('/bancos', bancosSangueRoutes);
app.use('/doacoes', doacoesRoutes);
app.use('/necessidades-sangue', necessidadesSangueRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
}); 