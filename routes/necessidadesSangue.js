const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');

// POST - Criar nova necessidade de sangue
router.post('/registro', async (req, res) => {
    try {
        const {
            banco_sangue_id,
            tipo_sanguineo,
            nivel_urgencia,
            observacoes,
            quantidade_necessaria,
            data_limite
        } = req.body;

        // Verificar se o banco de sangue existe e está ativo
        const [banco] = await pool.execute(
            'SELECT id FROM bancos_sangue WHERE id = ? AND ativa = true',
            [banco_sangue_id]
        );

        if (banco.length === 0) {
            return res.status(404).json({
                error: 'Banco de sangue não encontrado ou inativo'
            });
        }

        const id = uuidv4();

        const query = `
            INSERT INTO necessidades_sangue (
                id,
                banco_sangue_id,
                tipo_sanguineo,
                nivel_urgencia,
                observacoes,
                quantidade_necessaria,
                data_limite
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await pool.execute(query, [
            id,
            banco_sangue_id,
            tipo_sanguineo,
            nivel_urgencia,
            observacoes,
            quantidade_necessaria,
            data_limite
        ]);

        res.status(201).json({
            message: 'Necessidade de sangue registrada com sucesso!',
            id: id
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao registrar necessidade de sangue' });
    }
});

// GET - Listar todas as necessidades ativas
router.get('/', async (req, res) => {
    try {
        const [necessidades] = await pool.execute(`
            SELECT 
                n.*,
                b.nome_organizacao,
                b.cidade,
                b.estado,
                b.contato,
                b.rua,
                b.numero,
                b.bairro,
                b.cep
            FROM necessidades_sangue n
            JOIN bancos_sangue b ON b.id = n.banco_sangue_id
            WHERE n.status = true
            ORDER BY 
                CASE n.nivel_urgencia
                    WHEN 'CRITICA' THEN 1
                    WHEN 'ALTA' THEN 2
                    WHEN 'MEDIA' THEN 3
                    WHEN 'BAIXA' THEN 4
                END,
                n.data_registro DESC
        `);

        res.json({ necessidades });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar necessidades de sangue' });
    }
});

// GET - Buscar necessidades por tipo sanguíneo
router.get('/tipo/:tipo_sanguineo', async (req, res) => {
    try {
        const { tipo_sanguineo } = req.params;
        
        const [necessidades] = await pool.execute(`
            SELECT 
                n.*,
                b.nome_organizacao,
                b.cidade,
                b.estado,
                b.contato,
                b.rua,
                b.numero,
                b.bairro,
                b.cep
            FROM necessidades_sangue n
            JOIN bancos_sangue b ON b.id = n.banco_sangue_id
            WHERE n.status = true 
            AND n.tipo_sanguineo = ?
            ORDER BY 
                CASE n.nivel_urgencia
                    WHEN 'CRITICA' THEN 1
                    WHEN 'ALTA' THEN 2
                    WHEN 'MEDIA' THEN 3
                    WHEN 'BAIXA' THEN 4
                END,
                n.data_registro DESC
        `, [tipo_sanguineo]);

        res.json({ necessidades });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar necessidades de sangue' });
    }
});

// GET - Buscar necessidades por banco de sangue
router.get('/banco/:banco_id', async (req, res) => {
    try {
        const { banco_id } = req.params;
        
        const [necessidades] = await pool.execute(`
            SELECT *
            FROM necessidades_sangue
            WHERE banco_sangue_id = ?
            ORDER BY 
                status DESC,
                CASE nivel_urgencia
                    WHEN 'CRITICA' THEN 1
                    WHEN 'ALTA' THEN 2
                    WHEN 'MEDIA' THEN 3
                    WHEN 'BAIXA' THEN 4
                END,
                data_registro DESC
        `, [banco_id]);

        res.json({ necessidades });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar necessidades do banco' });
    }
});

// PATCH - Atualizar status da necessidade
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        await pool.execute(
            'UPDATE necessidades_sangue SET status = ? WHERE id = ?',
            [status, id]
        );

        res.json({
            message: `Necessidade ${status ? 'reativada' : 'encerrada'} com sucesso`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar status da necessidade' });
    }
});

// PUT - Atualizar necessidade
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            tipo_sanguineo,
            nivel_urgencia,
            observacoes,
            quantidade_necessaria,
            data_limite
        } = req.body;

        const query = `
            UPDATE necessidades_sangue
            SET 
                tipo_sanguineo = ?,
                nivel_urgencia = ?,
                observacoes = ?,
                quantidade_necessaria = ?,
                data_limite = ?
            WHERE id = ?
        `;

        const [result] = await pool.execute(query, [
            tipo_sanguineo,
            nivel_urgencia,
            observacoes,
            quantidade_necessaria,
            data_limite,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Necessidade não encontrada' });
        }

        res.json({ message: 'Necessidade atualizada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar necessidade' });
    }
});

// DELETE - Excluir necessidade
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM necessidades_sangue WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Necessidade não encontrada' });
        }

        res.json({ message: 'Necessidade excluída com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao excluir necessidade' });
    }
});

module.exports = router; 