import express from "express";
import * as usersServices from "../services/usersServices.js";
const router = express.Router();

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await usersServices.getAllusers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await usersServices.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const newUser = await usersServices.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    if (err.message.includes('Faltan datos')) {
      res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
});


export default router;