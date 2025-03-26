const express = require('express');
const cors = require('cors');
const swagger = require('./swagger');
const authRoutes = require('./routes/auth');
const doadoresRoutes = require('./routes/doadores');
const bancosSangueRoutes = require('./routes/bancoSangue');
const doacoesRoutes = require('./routes/doacoes');
const necessidadesSangueRoutes = require('./routes/necessidadesSangue');

const app = express();

// Middleware
app.use(cors()); // Permite todas as origens
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