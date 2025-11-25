import pool from "./db.js";
export const getAlRankings = async () => {
    const [rows] = await pool.execute('SELECT * FROM ranking ORDER BY id DESC');
  return rows;
};