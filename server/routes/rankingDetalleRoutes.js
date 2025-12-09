/**
 * @swagger
 * components:
 *   schemas:
 *     RankingDetalle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ranking_id:
 *           type: integer
 *           example: 2
 *         usuario_id:
 *           type: string
 *           example: "1234567890"
 *         puntos_totales:
 *           type: integer
 *           example: 0
 *         retos_cumplidos:
 *           type: integer
 *           example: 0
 *         fecha_generado:
 *           type: string
 *           format: date-time
 *           example: "2025-12-09T12:00:00Z"
 */

/**
 * @swagger
 * /api/rankingDetalles:
 *   get:
 *     summary: Obtener todos los detalles de ranking o por Top de un ranking
 *     tags: [RankingDetalles]
 *     parameters:
 *       - in: query
 *         name: top
 *         schema:
 *           type: string
 *         description: Top a consultar (1,2,3)
 *       - in: query
 *         name: ranking
 *         schema:
 *           type: integer
 *         description: ID del ranking
 *     responses:
 *       200:
 *         description: Lista de ranking detalles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RankingDetalle'
 *       404:
 *         description: Top no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankingDetalles/{id}:
 *   get:
 *     summary: Obtener un detalle de ranking por ID
 *     tags: [RankingDetalles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de ranking
 *     responses:
 *       200:
 *         description: Ranking detalle encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingDetalle'
 *       404:
 *         description: Ranking detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankingDetalles:
 *   post:
 *     summary: Crear un nuevo detalle de ranking
 *     tags: [RankingDetalles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ranking_id:
 *                 type: integer
 *                 example: 2
 *               usuario_id:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: Ranking detalle creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingDetalle'
 *       400:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error al crear ranking detalle
 */

/**
 * @swagger
 * /api/rankingDetalles/{id}:
 *   delete:
 *     summary: Eliminar un detalle de ranking por ID
 *     tags: [RankingDetalles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del detalle de ranking
 *     responses:
 *       200:
 *         description: Ranking detalle eliminado
 *       404:
 *         description: Ranking detalle no encontrado
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import * as rankingDetalleServices from "../services/rankingDetalleServices.js";

const router = express.Router();
// Obtener todos los rankings detalle
router.get('/', async (req, res) => {
  try {
     const { top,ranking } = req.query;
    if (top && ranking) {
          const rankingsdetalle = await rankingDetalleServices.getByTop(top,ranking);
          if (!rankingsdetalle) return res.status(404).json({ error: 'Ese Top no se ha encontrado' });
          return res.json(rankingsdetalle);
        }
    const rankingDetalle = await rankingDetalleServices.getAllRankingDetalles();
    res.json(rankingDetalle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las detalles ranking' });
  }
});

// Obtener ranking por ID
router.get('/:id', async (req, res) => {
  try {
    const ranking = await rankingDetalleServices.getById(req.params.id);
    if (!ranking) return res.status(404).json({ error: 'Ranking detalle no encontrado' });
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ranking detalle' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newranking = await rankingDetalleServices.create(req.body);
    res.status(201).json(newranking);
  } catch (err) {
    if (err.message.includes('el ranking detalle no puede estar vacío')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('ERROR REAL:', err); 
  res.status(500).json({ error: err.message || 'Error al agregar ranking detalle' });
    }
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const result = await rankingDetalleServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'ranking detalle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar ranking detalle' });
    }
  }
});

export default router;