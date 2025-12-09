/**
 * @swagger
 * /api/participaciones:
 *   get:
 *     summary: Obtener todas las participaciones
 *     tags: [Participations]
 *     responses:
 *       200:
 *         description: Lista de todas las participaciones
 *       500:
 *         description: Error al obtener las participaciones
 */
 
/**
 * @swagger
 * /api/participaciones/{id}:
 *   get:
 *     summary: Obtener una participación por ID
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la participación
 *     responses:
 *       200:
 *         description: Participación encontrada
 *       404:
 *         description: Participación no encontrada
 *       500:
 *         description: Error al obtener la participación
 */

/**
 * @swagger
 * /api/participaciones:
 *   post:
 *     summary: Crear una nueva participación (usuario o admin)
 *     tags: [Participations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - reto_id
 *             properties:
 *               usuario_id:
 *                 type: string
 *                 description: ID del usuario participante
 *               reto_id:
 *                 type: integer
 *                 description: ID del reto
 *     responses:
 *       201:
 *         description: Participación creada exitosamente
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/participaciones/{id}:
 *   put:
 *     summary: Actualizar el estado de una participación (solo admin)
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la participación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 enum: [pendiente, completado]
 *                 description: Nuevo estado de la participación
 *     responses:
 *       200:
 *         description: Participación actualizada exitosamente
 *       400:
 *         description: Participación no encontrada o datos inválidos
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/participaciones/{id}:
 *   delete:
 *     summary: Eliminar una participación (solo admin)
 *     tags: [Participations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la participación
 *     responses:
 *       200:
 *         description: Participación eliminada exitosamente
 *       404:
 *         description: Participación no encontrada
 *       500:
 *         description: Error al eliminar la participación
 */
import express from "express";
import * as participationsServices from "../services/participationsServices.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
const router = express.Router();

// Obtener todas la participaciones
router.get('/', async (req, res) => {
  try {
    const participations = await participationsServices.getAllparticipations();
    res.json(participations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las participaciones' });
  }
});

// Obtener participaciones por ID
router.get('/:id', async (req, res) => {
  try {
    const participations = await participationsServices.getById(req.params.id);
    if (!participations) return res.status(404).json({ error: 'participacion no encontrado' });
    res.json(participations);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener participacion' });
  }
});

router.post('/', allowRoles('user','admin'), async (req, res) => {
  try {
    const nueva = await participationsServices.create(req.body);
    res.status(201).json(nueva);
  } catch (err) {
    if (err.message.includes('no puede estar vacía')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al crear participación' });
    }
  }
});


router.put('/:id', allowRoles('admin'),async (req, res) => {
  try {
    const updated = await participationsServices.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'participation not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar participacion' });
    }
  }
});


router.delete('/:id', allowRoles('admin'),async (req, res) => {
  try {
    const result = await participationsServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar participantes' });
    }
  }
});

export default router;