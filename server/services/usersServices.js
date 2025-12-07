import pool from "./db.js";
import bcrypt from'../node_modules/bcrypt/bcrypt.js';

export const getAllusers = async () => {
    const [rows] = await pool.execute('SELECT id, nombre, correo, role, edad,peso,altura FROM usuarios ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT id, nombre, correo, role, edad,peso,altura FROM usuarios WHERE id = ?', [id]);
  return rows[0];
};

export const create = async (user) => {
  const { id, nombre, correo, contrasena, role, edad,peso,altura} = user;
  if (!id || !nombre || !correo || !contrasena || !role || !edad || !peso || !altura)
    throw new Error('Faltan datos del usuario');

  const hashedPassword = await bcrypt.hash(contrasena, 10);
  const [result] = await pool.execute(
    'INSERT INTO usuarios (id, nombre, correo, contrasena, role, edad,peso,altura) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, nombre, correo, hashedPassword, role, edad,peso,altura]
  );
  return getById(result.insertId);
};

export const validateCredentials = async (nombre, contrasena) => {
  const [rows] = await pool.execute('SELECT * FROM usuarios WHERE nombre = ?', [nombre]);
  if (rows.length === 0) return null;
  const user = rows[0];
  const valid = await bcrypt.compare(contrasena, user.contrasena);
  if (!valid) return null;
  delete user.contrasena;
  return user;
};

export const update = async (id, user) => {
  const { nombre, correo, contrasena,role,edad,peso,altura } = user;
  const fields = [];
  const values = [];

  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (correo!== undefined) { fields.push('correo = ?'); values.push(correo); }
if (contrasena !== undefined) { 
const hashedPassword = await bcrypt.hash(contrasena, 10); fields.push('contrasena = ?');  values.push(hashedPassword);  } 
  if (role !== undefined) { fields.push('role = ?'); values.push(role); }  
  if (edad !== undefined) { fields.push('edad = ?'); values.push(edad); }
  if (peso !== undefined) { fields.push('peso = ?'); values.push(peso); }
  if (altura !== undefined) { fields.push('altura = ?'); values.push(altura); }

  if (fields.length === 0) throw new Error('No hay datos para actualizar');

  values.push(id);
  const [result] = await pool.execute(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) throw new Error('User not found');

  return getById(id);
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM usuarios WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully'};
};