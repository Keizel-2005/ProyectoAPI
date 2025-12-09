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