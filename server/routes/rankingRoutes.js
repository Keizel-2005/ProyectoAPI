import express from "express";
import * as rankingServices from "../services/rankingServices.js";
import { allowRoles } from "../middlewares/roleMiddleware.js";
const router = express.Router();
// Obtener todos los rankings
router.get('/', async (req, res) => {
  try {
    const participations = await rankingServices.getAllRankings();
    res.json(participations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los rankings' });
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

export default router;