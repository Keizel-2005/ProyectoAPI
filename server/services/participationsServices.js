import pool from "./db.js";

export const getAllparticipations = async () => {
    const [rows] = await pool.execute(`SELECT 
       p.id,
       p.usuario_id,
       u.nombre AS usuario_nombre,
       p.reto_id,
       r.nombre AS reto_nombre,
       p.estado,
       p.fecha_union,
       p.fecha_completado,
       p.puntos_obtenidos
     FROM participaciones p
     INNER JOIN usuarios u ON p.usuario_id = u.id
     INNER JOIN retos r ON p.reto_id = r.id ORDER BY id DESC`);
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
