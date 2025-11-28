import pool from "./db.js";

export const getAllchallenges = async () => {
    const [rows] = await pool.execute('SELECT * FROM retos ORDER BY id DESC');
  return rows;
};

export const getById = async(id)=>{
  const [rows] = await pool.execute('SELECT * FROM  retos WHERE id = ?', [id]);
  return rows[0];

}