import pool from "./db.js";

export const getAllparticipations = async () => {
    const [rows] = await pool.execute('SELECT * FROM participaciones ORDER BY id DESC');
  return rows;
};


export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM participaciones WHERE id = ?', [id]);
  return rows [0];
};