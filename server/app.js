import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import participationsRoutes from './routes/participationsRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import challengesRoutes from './routes/challengesRoutes.js';
import pool from './services/db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Montar rutas
app.use('/api/users', usersRoutes);  // /api/tasks si usas 'tasks'
app.use('/api/participaciones', participationsRoutes);
app.use('/api/rankings', rankingRoutes);
app.use('/api/retos', challengesRoutes);

// Probar conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conectado a MariaDB');
    connection.release();
  } catch (err) {
    console.error('Error conectando a la DB:', err);
  }
})();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});