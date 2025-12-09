/**
 * @swagger
 * components:
 *   schemas:
 *     Ranking:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: "Ranking Fit Challenge"
 *         descripcion:
 *           type: string
 *           example: "Ranking de los participantes de Fitness"
 *         fecha_creado:
 *           type: string
 *           format: date-time
 *           example: "2025-12-09T12:00:00Z"
 */

/**
 * @swagger
 * /api/rankings:
 *   get:
 *     summary: Obtener todos los rankings o filtrar por nombre
 *     tags: [Rankings]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar rankings por nombre
 *     responses:
 *       200:
 *         description: Lista de rankings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ranking'
 *       404:
 *         description: Ranking no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankings/{id}:
 *   get:
 *     summary: Obtener un ranking por ID
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ranking
 *     responses:
 *       200:
 *         description: Ranking encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ranking'
 *       404:
 *         description: Ranking no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankings:
 *   post:
 *     summary: Crear un nuevo ranking (solo admin)
 *     tags: [Rankings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ranking Fit Challenge"
 *               descripcion:
 *                 type: string
 *                 example: "Ranking de los participantes de Fitness"
 *     responses:
 *       201:
 *         description: Ranking creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ranking'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankings/{id}:
 *   put:
 *     summary: Actualizar un ranking por ID (solo admin)
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ranking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos opcionales para actualizar
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Ranking Fit Challenge Actualizado"
 *               descripcion:
 *                 type: string
 *                 example: "Nueva descripción del ranking"
 *     responses:
 *       200:
 *         description: Ranking actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ranking'
 *       400:
 *         description: No hay datos o ranking no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/rankings/{id}:
 *   delete:
 *     summary: Eliminar un ranking por ID (solo admin)
 *     tags: [Rankings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del ranking
 *     responses:
 *       200:
 *         description: Ranking eliminado
 *       404:
 *         description: Ranking no encontrado
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import * as rankingServices from "../services/rankingServices.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { nombre } = req.query;
    if (nombre) {
      const rankings = await rankingServices.getByNombre(nombre);
      if (!rankings) return res.status(404).json({ error: 'Ranking no encontrado' });
      return res.json(rankings);
    }
    const ranking = await rankingServices.getAllRankings();
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los ranking' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ranking = await rankingServices.getById(req.params.id);
    if (!ranking) return res.status(404).json({ error: 'Ranking no encontrado' });
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

router.post('/',allowRoles('admin'), async (req, res) => {
  try {
    const newranking = await rankingServices.create(req.body);
    res.status(201).json(newranking);
  } catch (err) {
    if (err.message.includes('el ranking no puede estar vacío')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('Error al insertar:', err);
      res.status(500).json({ error: 'Error al agregar ranking' });
    }
  }
});

router.put('/:id',allowRoles('admin'), async (req, res) => {
  try {
    const updated = await rankingServices.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Ranking not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar ranking' });
    }
  }
});

router.delete('/:id',allowRoles('admin'),async (req, res) => {
  try {
    const result = await rankingServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar ranking' });
    }
  }
});

export default router;