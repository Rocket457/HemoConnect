const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Rota de login unificada
router.post('/login', async (req, res) => {
    try {
        const { email, senha, tipo } = req.body;

        if (!['doador', 'banco'].includes(tipo)) {
            return res.status(400).json({ error: 'Tipo de usuário inválido' });
        }

        const tabela = tipo === 'doador' ? 'doadores' : 'bancos_sangue';
        let query = `SELECT * FROM ${tabela} WHERE email = ?`;
        
        // Adiciona verificação de conta ativa para bancos de sangue
        if (tipo === 'banco') {
            query += ' AND ativa = true';
        }

        const [rows] = await pool.execute(query, [email]);

        if (rows.length === 0) {
            return res.status(401).json({ 
                error: tipo === 'doador' 
                    ? 'Doador não encontrado' 
                    : 'Banco de sangue não encontrado ou conta desativada'
            });
        }

        const usuario = rows[0];
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Remove a senha do objeto antes de enviar
        delete usuario.senha;
        
        res.json({ 
            tipo,
            usuario,
            // Aqui você pode adicionar um token JWT se implementar autenticação com tokens
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

module.exports = router;