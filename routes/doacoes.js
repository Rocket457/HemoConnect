const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// Registrar nova doação
router.post('/', async (req, res) => {
    try {
        const { doador_id, banco_id, data_doacao } = req.body;

        // Verificar se o doador existe
        const [doador] = await pool.execute(
            'SELECT id FROM doadores WHERE id = ?',
            [doador_id]
        );

        if (doador.length === 0) {
            return res.status(404).json({ error: 'Doador não encontrado' });
        }

        // Verificar se o banco de sangue existe e está ativo
        const [banco] = await pool.execute(
            'SELECT id FROM bancos_sangue WHERE id = ? AND ativa = true',
            [banco_id]
        );

        if (banco.length === 0) {
            return res.status(404).json({ 
                error: 'Banco de sangue não encontrado ou inativo' 
            });
        }

        // Registrar a doação
        const id = uuidv4();
        await pool.execute(
            `INSERT INTO historico_doacoes (id, doador_id, banco_id, data_doacao) 
             VALUES (?, ?, ?, ?)`,
            [id, doador_id, banco_id, data_doacao]
        );

        // Atualizar a última doação do doador
        await pool.execute(
            `UPDATE doadores 
             SET ultima_doacao = ?, ultimo_banco = (
                 SELECT nome_organizacao 
                 FROM bancos_sangue 
                 WHERE id = ?
             )
             WHERE id = ?`,
            [data_doacao, banco_id, doador_id]
        );

        res.status(201).json({ 
            message: 'Doação registrada com sucesso',
            doacao_id: id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar doação' });
    }
});

// Listar doações de um doador
router.get('/doador/:doador_id', async (req, res) => {
    try {
        const { doador_id } = req.params;
        
        const [doacoes] = await pool.execute(
            `SELECT 
                hd.id,
                hd.data_doacao,
                bs.nome_organizacao as banco_nome,
                bs.cidade as banco_cidade,
                bs.estado as banco_estado
             FROM historico_doacoes hd
             JOIN bancos_sangue bs ON bs.id = hd.banco_id
             WHERE hd.doador_id = ?
             ORDER BY hd.data_doacao DESC`,
            [doador_id]
        );

        res.json({ doacoes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar histórico de doações' });
    }
});

// Listar doações recebidas por um banco de sangue
router.get('/banco/:banco_id', async (req, res) => {
    try {
        const { banco_id } = req.params;
        
        const [doacoes] = await pool.execute(
            `SELECT 
                hd.id,
                hd.data_doacao,
                d.nome as doador_nome,
                d.tipo_sanguineo
             FROM historico_doacoes hd
             JOIN doadores d ON d.id = hd.doador_id
             WHERE hd.banco_id = ?
             ORDER BY hd.data_doacao DESC`,
            [banco_id]
        );

        res.json({ doacoes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar doações do banco' });
    }
});

module.exports = router; 