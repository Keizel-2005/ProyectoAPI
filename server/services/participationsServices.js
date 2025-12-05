import pool from "./db.js";

export const getAllparticipations = async () => {
    const [rows] = await pool.execute('SELECT * FROM participaciones ORDER BY id DESC');
  return rows;
};


export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM participaciones WHERE id = ?', [id]);
  return rows [0];
};

export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM participaciones WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('User not found');
  return { message: 'User deleted successfully'};
};
