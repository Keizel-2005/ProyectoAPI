/**
 * @swagger
 * /api/retos:
 *   get:
 *     summary: Obtener todos los retos
 *     tags: [Challenges]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Filtrar retos por nombre
 *     responses:
 *       200:
 *         description: Lista de retos
 *       404:
 *         description: Retos no encontrados
 *       500:
 *         description: Error al obtener los retos
 */

/**
 * @swagger
 * /api/retos/{id}:
 *   get:
 *     summary: Obtener un reto por ID
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     responses:
 *       200:
 *         description: Reto encontrado
 *       404:
 *         description: Reto no encontrado
 *       500:
 *         description: Error al obtener el reto
 */

/**
 * @swagger
 * /api/retos:
 *   post:
 *     summary: Crear un nuevo reto (solo admin)
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - descripcion
 *               - nivel
 *               - puntos
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del reto
 *               descripcion:
 *                 type: string
 *                 description: Descripción del reto
 *               nivel:
 *                 type: string
 *                 description: Nivel del reto
 *               puntos:
 *                 type: integer
 *                 description: Puntos que otorga el reto
 *     responses:
 *       201:
 *         description: Reto creado exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/retos/{id}:
 *   put:
 *     summary: Actualizar un reto por ID (solo admin)
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               nivel:
 *                 type: string
 *               puntos:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Reto actualizado exitosamente
 *       400:
 *         description: Reto no encontrado o datos inválidos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/retos/{id}:
 *   delete:
 *     summary: Eliminar un reto por ID (solo admin)
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del reto
 *     responses:
 *       200:
 *         description: Reto eliminado exitosamente
 *       404:
 *         description: Reto no encontrado
 *       500:
 *         description: Error al eliminar el reto
 */
import express from "express";
import * as challengesServices from "../services/challengesServices.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
const router = express.Router();

// Obtener todas la retos
router.get('/', async (req, res) => {
  try {
    const { nombre } = req.query;
    if (nombre) {
      const retos = await challengesServices.getByNombre(nombre);
      if (!retos) return res.status(404).json({ error: 'Retos no encontrado' });
      return res.json(retos);
    }
    const reto = await challengesServices.getAllchallenges();
    res.json(reto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los retos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const reto = await challengesServices.getById(req.params.id);
    if (!reto) return res.status(404).json({ error: 'reto no encontrado' });
    res.json(reto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener reto' });
  }
});

router.post('/', allowRoles('admin'), async (req, res) => {
  try {
    const nuevo = await challengesServices.create(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    if (err.message.includes('no puede estar vacío')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al crear reto' });
    }
  }
});


router.put('/:id', allowRoles('admin'),async (req, res) => {
  try {
    const updated = await challengesServices.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'Challenge not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar reto' });
    }
  }
});

router.delete('/:id',allowRoles('admin'), async (req, res) => {
  try {
    const result = await challengesServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar retos' });
    }
  }
});


export default router;