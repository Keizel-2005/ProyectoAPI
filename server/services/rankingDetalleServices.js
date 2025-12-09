import pool from "./db.js";

export const getAllRankingDetalles = async () => {
    const [rows] = await pool.execute('SELECT * FROM ranking_detalle ORDER BY id DESC');
  return rows;
};

export const getById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM ranking_detalle WHERE id = ?', [id]);
  return rows[0];
};

export const getByTop = async (top,ranking) => {
  const [rows] = await pool.execute('SELECT * FROM ranking_detalle WHERE ranking_id = ? ORDER BY puntos_totales DESC',[ranking]);
  if(top === "1"){
 return rows[0];
  };
  if(top === "2"){
 return rows[1];
  };
  if(top === "3"){
 return rows[2];
  };
  return null;
};

export const create = async(rankingdetalle)=>{
const {ranking_id, usuario_id} = rankingdetalle;
 if (!ranking_id || !ranking_id.trim()|| !usuario_id|| !usuario_id.trim()) {
    throw new Error('El participante del ranking tiene que indicar el id del ranking y su id');
  }
  const [result] = await pool.execute(
    'INSERT INTO ranking_detalle (ranking_id, usuario_id, puntos_totales, retos_cumplidos ) VALUES (?,?,0,0)',
    [ranking_id.trim(),usuario_id.trim()]
  );
  const [newranking] = await pool.execute('SELECT * FROM ranking WHERE id = ?', [result.insertId]);
  return newranking[0];
};


export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM ranking_detalle WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('ranking detalle not found');
  return { message: 'ranking detalle deleted successfully'};
};


