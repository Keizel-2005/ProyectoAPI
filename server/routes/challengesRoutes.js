import express from "express";
import * as challengesServices from "../services/challengesServices.js";
const router = express.Router();

// Obtener todas la retos
router.get('/', async (req, res) => {
  try {
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

router.delete('/:id', async (req, res) => {
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