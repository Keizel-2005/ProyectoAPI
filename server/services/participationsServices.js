import pool from "./db.js";

export const getAllparticipations = async () => {
    const [rows] = await pool.execute('SELECT * FROM participaciones ORDER BY id DESC');
  return rows;
};