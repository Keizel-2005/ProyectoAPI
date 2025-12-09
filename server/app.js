import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import participationsRoutes from './routes/participationsRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import challengesRoutes from './routes/challengesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { verifyToken } from './middlewares/authMiddleware.js';
import { allowRoles } from './middlewares/roleMiddleware.js';
import pool from './services/db.js';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
// Rutas públicas
app.use('/api/auth', authRoutes);

// rutas protegidas
app.use('/api/users', allowRoles("admin"), usersRoutes); 
app.use('/api/participaciones', participationsRoutes);
app.use('/api/rankings', verifyToken, rankingRoutes);
app.use('/api/retos', verifyToken,challengesRoutes);

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