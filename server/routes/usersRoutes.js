

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         nombre:
 *           type: string
 *         correo:
 *           type: string
 *         role:
 *           type: string
 *         edad:
 *           type: integer
 *         peso:
 *           type: number
 *         altura:
 *           type: number
 *       example:
 *         id: "118990022"
 *         nombre: "Erik"
 *         correo: "erik@mail.com"
 *         role: "admin"
 *         edad: 19
 *         peso: 70.5
 *         altura: 176
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtiene todos los usuarios o filtra por nombre
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *         description: Nombre exacto del usuario a buscar
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - nombre
 *               - correo
 *               - contrasena
 *               - role
 *               - edad
 *               - peso
 *               - altura
 *             properties:
 *               id:
 *                 type: string
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               role:
 *                 type: string
 *               edad:
 *                 type: integer
 *               peso:
 *                 type: number
 *               altura:
 *                 type: number
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos faltantes o inválidos
 *       500:
 *         description: Error al crear usuario
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos opcionales para actualizar
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               correo:
 *                 type: string
 *                 example: "juan@example.com"
 *               contrasena:
 *                 type: string
 *                 example: "nuevaContrasena123"
 *               role:
 *                 type: string
 *                 example: "admin"
 *               edad:
 *                 type: integer
 *                 example: 25
 *               peso:
 *                 type: number
 *                 example: 70.5
 *               altura:
 *                 type: number
 *                 example: 1.75
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Usuario no encontrado o sin datos para actualizar
 *       500:
 *         description: Error al actualizar
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error del servidor
 */

import express from "express";
import * as usersServices from "../services/usersServices.js";
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { nombre } = req.query;
    if (nombre) {
      const users = await usersServices.getByNombre(nombre);
      if (!users) return res.status(404).json({ error: 'Usuario no encontrado' });
      return res.json(users);
    }
    const user = await usersServices.getAllusers();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const user = await usersServices.getById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

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

router.put('/:id', async (req, res) => {
  try {
    const updated = await usersServices.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    if (err.message === 'User not found' || err.message === 'No hay datos para actualizar') {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const result = await usersServices.deleteById(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'User not found') {
      res.status(404).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  }
});


export default router;