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

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM retos WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully'};
};
