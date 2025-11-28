import pool from "./db.js";

export const getAllRankings = async () => {
    const [rows] = await pool.execute('SELECT * FROM ranking ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM ranking WHERE id = ?', [id]);
  return rows[0];
};

export const create = async(ranking)=>{
const {nombre, descripcion} = ranking;
 if (!nombre || !nombre.trim()|| !descripcion|| !descripcion.trim()) {
    throw new Error('El ranking no puede estar vacío');
  }
  const [result] = await pool.execute(
    'INSERT INTO ranking (nombre, descripcion ) VALUES (?,?)',
    [nombre.trim(),descripcion.trim()]
  );
  const [newranking] = await pool.execute('SELECT * FROM ranking WHERE id = ?', [result.insertId]);
  return newranking[0];
};


