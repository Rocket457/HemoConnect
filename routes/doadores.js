const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const pool = require('../config/database');

// Listar todos os doadores ativos com informações básicas
router.get('/listar', async (req, res) => {
    try {
        const [doadores] = await pool.execute(`
            SELECT 
                d.id,
                d.nome,
                d.tipo_sanguineo,
                d.contato,
                d.cidade,
                d.estado,
                d.ultima_doacao,
                d.ultimo_banco
            FROM doadores d 
            ORDER BY d.nome ASC
        `);

        res.json({ doadores: doadores || [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao listar doadores' });
    }
});

// Rota de registro do doador
router.post('/registro', async (req, res) => {
    try {
        const {
            nome, tipo_sanguineo, data_nascimento,
            peso, contato, cep, cidade, estado,
            rua, numero, bairro, email, senha
        } = req.body;

        // Validação dos campos obrigatórios
        if (!nome || !tipo_sanguineo || !data_nascimento || !peso || 
            !contato || !cep || !cidade || !estado || 
            !rua || !numero || !bairro || !email || !senha) {
            return res.status(400).json({ 
                error: 'Todos os campos são obrigatórios' 
            });
        }

        // Validação do tipo sanguíneo
        const tiposValidos = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
        if (!tiposValidos.includes(tipo_sanguineo)) {
            return res.status(400).json({ 
                error: 'Tipo sanguíneo inválido' 
            });
        }

        // Validação do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Email inválido' 
            });
        }

        // Verificar se já existe um doador com este email
        const [existente] = await pool.execute(
            'SELECT id FROM doadores WHERE email = ?',
            [email]
        );

        if (existente.length > 0) {
            return res.status(400).json({ 
                error: 'Já existe um doador registrado com este email' 
            });
        }

        // Hash da senha
        const hashedSenha = await bcrypt.hash(senha, 10);
        
        // Gerar UUID
        const id = uuidv4();

        const query = `
            INSERT INTO doadores (
                id, nome, tipo_sanguineo, data_nascimento,
                peso, contato, cep, cidade, estado,
                rua, numero, bairro, email, senha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(query, [
            id, nome, tipo_sanguineo, data_nascimento,
            peso, contato, cep, cidade, estado,
            rua, numero, bairro, email, hashedSenha
        ]);

        res.status(201).json({ message: 'Doador registrado com sucesso!' });
    } catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({ 
            error: 'Erro ao registrar doador',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Buscar doadores por tipo sanguíneo (rota 1)
router.get('/tipo/:tipo_sanguineo', async (req, res) => {
    try {
        const { tipo_sanguineo } = req.params;
        
        const [doadores] = await pool.execute(`
            SELECT 
                d.id,
                d.nome,
                d.tipo_sanguineo,
                d.contato,
                d.cidade,
                d.estado,
                d.ultima_doacao,
                d.ultimo_banco
            FROM doadores d
            WHERE d.tipo_sanguineo = ?
            ORDER BY d.nome ASC
        `, [tipo_sanguineo]);

        res.json({ doadores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar doadores por tipo sanguíneo' });
    }
});

// Buscar doadores por tipo sanguíneo (rota 2)
router.get('/busca/tipo-sanguineo/:tipo', async (req, res) => {
    try {
        const { tipo } = req.params;

        const [doadores] = await pool.execute(
            `SELECT 
                id, nome, cidade, estado, tipo_sanguineo,
                ultima_doacao
             FROM doadores 
             WHERE tipo_sanguineo = ?
             ORDER BY ultima_doacao ASC`,
            [tipo]
        );

        res.json({ doadores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar doadores' });
    }
});

// Buscar doadores por cidade/estado
router.get('/busca/localizacao', async (req, res) => {
    try {
        const { cidade, estado } = req.query;
        let query = 'SELECT id, nome, cidade, estado, tipo_sanguineo FROM doadores WHERE 1=1';
        const params = [];

        if (cidade) {
            query += ' AND cidade = ?';
            params.push(cidade);
        }

        if (estado) {
            query += ' AND estado = ?';
            params.push(estado);
        }

        const [doadores] = await pool.execute(query, params);
        res.json({ doadores });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar doadores' });
    }
});

// Buscar doador por ID (rotas dinâmicas abaixo)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(
            `SELECT 
                id, nome, contato, email, cep,
                cidade, estado, rua, numero, idade,
                tipo_sanguineo, ultima_doacao, ultimo_banco
             FROM doadores 
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }

        res.json({ doador: rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar doador' });
    }
});

// Atualizar dados do doador
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nome, contato, cep, cidade, estado,
            rua, numero, idade, tipo_sanguineo
        } = req.body;

        // Verificar se o doador existe
        const [doador] = await pool.execute(
            'SELECT id FROM doadores WHERE id = ?',
            [id]
        );

        if (doador.length === 0) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }

        const query = `
            UPDATE doadores 
            SET nome = ?, contato = ?, cep = ?,
                cidade = ?, estado = ?, rua = ?,
                numero = ?, idade = ?, tipo_sanguineo = ?
            WHERE id = ?
        `;

        await pool.execute(query, [
            nome, contato, cep, cidade, estado,
            rua, numero, idade, tipo_sanguineo, id
        ]);

        res.json({ message: 'Dados atualizados com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar dados do doador' });
    }
});

// Alterar senha do doador
router.patch('/:id/senha', async (req, res) => {
    try {
        const { id } = req.params;
        const { senha_atual, nova_senha } = req.body;

        // Buscar doador e verificar senha atual
        const [rows] = await pool.execute(
            'SELECT senha FROM doadores WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }

        const senhaValida = await bcrypt.compare(senha_atual, rows[0].senha);
        if (!senhaValida) {
            return res.status(401).json({ error: 'Senha atual incorreta' });
        }

        // Hash da nova senha
        const hashedSenha = await bcrypt.hash(nova_senha, 10);

        // Atualizar senha
        await pool.execute(
            'UPDATE doadores SET senha = ? WHERE id = ?',
            [hashedSenha, id]
        );

        res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao alterar senha' });
    }
});

module.exports = router;
