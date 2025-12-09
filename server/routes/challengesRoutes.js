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

export const create = async (challenge) => {
  const { nombre, descripcion, nivel, puntos } = challenge;

  if (
    !nombre || !nombre.trim() ||
    !descripcion || !descripcion.trim() ||
    !nivel ||
    puntos === undefined
  ) {
    throw new Error('El reto no puede estar vacío');
  }

  const [result] = await pool.execute(
    `INSERT INTO retos (nombre, descripcion, nivel, puntos)
     VALUES (?, ?, ?, ?)`,
    [nombre.trim(), descripcion.trim(), nivel, puntos]
  );

  const [nuevoReto] = await pool.execute(
    'SELECT * FROM retos WHERE id = ?',
    [result.insertId]
  );

  return nuevoReto[0];
};

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