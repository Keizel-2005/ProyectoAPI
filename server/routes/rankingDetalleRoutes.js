import express from "express";
import * as rankingDetalleServices from "../services/rankingDetalleServices.js";

const router = express.Router();
// Obtener todos los rankings detalle
router.get('/', async (req, res) => {
  try {
     const { top,ranking } = req.query;
    if (top && ranking) {
          const rankingsdetalle = await rankingDetalleServices.getByTop(top,ranking);
          if (!rankingsdetalle) return res.status(404).json({ error: 'Ese Top no se ha encontrado' });
          return res.json(rankingsdetalle);
        }
    const rankingDetalle = await rankingDetalleServices.getAllRankingDetalles();
    res.json(rankingDetalle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener las detalles ranking' });
  }
});

// Obtener ranking por ID
router.get('/:id', async (req, res) => {
  try {
    const ranking = await rankingDetalleServices.getById(req.params.id);
    if (!ranking) return res.status(404).json({ error: 'Ranking detalle no encontrado' });
    res.json(ranking);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ranking detalle' });
  }
});

router.post('/', async (req, res) => {
  try {
    const newranking = await rankingDetalleServices.create(req.body);
    res.status(201).json(newranking);
  } catch (err) {
    if (err.message.includes('el ranking detalle no puede estar vacío')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error('ERROR REAL:', err); 
  res.status(500).json({ error: err.message || 'Error al agregar ranking detalle' });
    }
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const result = await rankingDetalleServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'ranking detalle not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar ranking detalle' });
    }
  }
});

export default router;