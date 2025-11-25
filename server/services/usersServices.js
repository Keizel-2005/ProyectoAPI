import pool from "./db.js";

export const getAllusers = async () => {
    const [rows] = await pool.execute('SELECT id, nombre, correo, edad,peso,altura FROM usuarios ORDER BY id DESC');
  return rows;
};