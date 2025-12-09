import pool from "./db.js";

export const getAllchallenges = async () => {
    const [rows] = await pool.execute('SELECT * FROM retos ORDER BY id DESC');
  return rows;
};

export const getById = async(id)=>{
  const [rows] = await pool.execute('SELECT * FROM  retos WHERE id = ?', [id]);
  return rows[0];

}

export const getByNombre = async(nombre)=>{
  const [rows] = await pool.execute('SELECT * FROM retos WHERE nombre = ?', [nombre]);
  return rows;

}

export const create = async(challenge)=>{
  const {nombre,descripcion,nivel,punto} = challenge
  

};

export const update = async (id, data) => {
  const { nombre, descripcion, nivel, punto } = data;
  const fields = [];
  const values = [];
  if (nombre !== undefined) { fields.push('nombre = ?'); values.push(nombre); }
  if (descripcion !== undefined) { fields.push('descripcion = ?'); values.push(descripcion); } 
  if (nivel !== undefined) { fields.push('nivel = ?'); values.push(nivel); }
  if (punto !== undefined) { fields.push('punto = ?'); values.push(punto); }
  if (fields.length === 0) throw new Error('No hay datos para actualizar');
  values.push(id);
  const [result] = await pool.execute(
    `UPDATE retos SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
  if (result.affectedRows === 0) throw new Error('Challenge not found');
  return getById(id);
}




export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM retos WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully'};
};
