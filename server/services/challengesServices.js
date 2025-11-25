import pool from "./db.js";

export const getAllchallenges = async () => {
    const [rows] = await pool.execute('SELECT * FROM retos ORDER BY id DESC');
  return rows;
};