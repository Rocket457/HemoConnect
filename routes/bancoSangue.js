const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Rota de registro do banco de sangue
router.post('/registro', async (req, res) => {
    try {
        const {
            nome_organizacao, cep, cidade, estado,
            rua, numero, bairro, responsavel,
            contato, site, email, senha,
            cnpj, razao_social
        } = req.body;

        // Verificar se já existe um banco com este CNPJ ou email
        const [existente] = await pool.execute(
            'SELECT id FROM bancos_sangue WHERE cnpj = ? OR email = ?',
            [cnpj, email]
        );

        if (existente.length > 0) {
            return res.status(400).json({ 
                error: 'Já existe um banco de sangue registrado com este CNPJ ou email' 
            });
        }

        // Hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);
        
        // Gerar UUID
        const id = uuidv4();

        const query = `
            INSERT INTO bancos_sangue (
                id, nome_organizacao, cep, cidade, estado,
                rua, numero, bairro, responsavel, contato,
                site, email, senha, cnpj, razao_social
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(query, [
            id, nome_organizacao, cep, cidade, estado,
            rua, numero, bairro, responsavel, contato,
            site || null, email, hashedSenha, cnpj, razao_social
        ]);

        res.status(201).json({ message: 'Banco de sangue registrado com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar banco de sangue' });
    }
});

// Rota de login do banco de sangue
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const [rows] = await pool.execute(
            'SELECT * FROM bancos_sangue WHERE email = ? AND ativa = true',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ 
                error: 'Banco de sangue não encontrado ou conta desativada' 
            });
        }

        const banco = rows[0];
        const senhaValida = await bcrypt.compare(senha, banco.senha);

        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha incorreta' });
        }

        // Remove a senha do objeto antes de enviar
        delete banco.senha;
        
        res.json({ banco });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao realizar login' });
    }
});

// Rota para atualizar status de ativação
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { ativa } = req.body;

        await pool.execute(
            'UPDATE bancos_sangue SET ativa = ? WHERE id = ?',
            [ativa, id]
        );

        res.json({ 
            message: `Banco de sangue ${ativa ? 'ativado' : 'desativado'} com sucesso` 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar status do banco de sangue' });
    }
});

module.exports = router; 