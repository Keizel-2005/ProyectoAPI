import express from 'express';
import { login } from '../services/authServices.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { nombre, contrasena } = req.body;
  try {
    const result = await login(nombre, contrasena);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

export default router;