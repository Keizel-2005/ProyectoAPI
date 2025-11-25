import express from "express";
import * as challengesServices from "../services/challengesServices.js";
const router = express.Router();

// Obtener todas la participaciones
router.get('/', async (req, res) => {
  try {
    const participations = await challengesServices.getAllchallenges();
    res.json(participations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los retos' });
  }
});


export default router;