import express from "express";
import * as participationsServices from "../services/participationsServices.js";
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


export default router;