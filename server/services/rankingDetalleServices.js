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

export const create = async (rankingdetalle) => {
  let { ranking_id, usuario_id } = rankingdetalle;
  ranking_id = Number(ranking_id);
  usuario_id = Number(usuario_id);
  if (!ranking_id || !usuario_id) {
    throw new Error('El participante del ranking tiene que indicar el id del ranking y su id');
  }
  const [rankingExists] = await pool.execute(
    'SELECT id FROM ranking WHERE id = ?', [ranking_id]
  );
  if (rankingExists.length === 0) {
    throw new Error('El ranking_id no existe');
  }
  const [userExists] = await pool.execute(
    'SELECT id FROM usuarios WHERE id = ?', [usuario_id]
  );
  if (userExists.length === 0) {
    throw new Error('El usuario_id no existe');
  }
  const [alreadyExists] = await pool.execute(
    'SELECT id FROM ranking_detalle WHERE ranking_id = ? AND usuario_id = ?', [ranking_id, usuario_id]
  );
  if (alreadyExists.length > 0) {
    throw new Error('El usuario ya está inscrito en este ranking');
  }
  const [result] = await pool.execute(
    'INSERT INTO ranking_detalle (ranking_id, usuario_id, puntos_totales, retos_cumplidos ) VALUES (?, ?, 0, 0)',[ranking_id, usuario_id]
  );
  const [newranking] = await pool.execute(
    'SELECT * FROM ranking_detalle WHERE id = ?',
    [result.insertId]
  );

  return newranking[0];
};



export const deleteById = async (id) => {
  const [result] = await pool.execute('DELETE FROM ranking_detalle WHERE id = ?', [id]);
  if (result.affectedRows === 0) throw new Error('ranking detalle not found');
  return { message: 'ranking detalle deleted successfully'};
};


