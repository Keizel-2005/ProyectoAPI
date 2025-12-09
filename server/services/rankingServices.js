import pool from "./db.js";

export const getAllRankings = async () => {
    const [rows] = await pool.execute('SELECT * FROM ranking ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM ranking WHERE id = ?', [id]);
  return rows[0];
};

export const getByNombre = async (nombre) => {
  const [rows] = await pool.execute('SELECT * FROM ranking WHERE nombre = ?', [nombre]);
  return rows;
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

export const update = async (id, ranking) => {
  const { nombre, descripcion } = ranking;
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); }
  if (fields.length === 0) throw new Error('No hay datos para actualizar');
  values.push(id);
  const [result] = await pool.execute(
    `UPDATE ranking SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) throw new Error('Ranking not found');
  return getById(id);
}


export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM ranking WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully'};
};


