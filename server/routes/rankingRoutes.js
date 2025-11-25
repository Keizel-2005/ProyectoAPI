import express from "express";
import * as rankingServices from "../services/rankingServices.js";
const router = express.Router();
// Obtener todos los rankings
router.get('/', async (req, res) => {
  try {
    const participations = await rankingServices.getAlRankings();
    res.json(participations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los rankings' });
  }
});
export default router;