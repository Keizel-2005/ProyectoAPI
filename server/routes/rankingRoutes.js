import express from "express";
import * as rankingServices from "../services/rankingServices.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();
// Obtener todos los rankings
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

// Obtener ranking por ID
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