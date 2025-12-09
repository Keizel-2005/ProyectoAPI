import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import usersRoutes from './routes/usersRoutes.js';
import participationsRoutes from './routes/participationsRoutes.js';
import rankingRoutes from './routes/rankingRoutes.js';
import challengesRoutes from './routes/challengesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import rankingDetalleRoutes from './routes/rankingDetalleRoutes.js';
import { verifyToken } from './middlewares/authMiddleware.js';
import { allowRoles } from './middlewares/roleMiddleware.js';
import pool from './services/db.js';
import { swaggerUi,swaggerSpec } from './swagger.js';

const app = express();
const PORT = 4000;
//documentacion swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());
// Rutas públicas
app.use('/api/auth', authRoutes);

// rutas protegidas
app.use('/api/users',verifyToken, allowRoles("admin"), usersRoutes); 
app.use('/api/participaciones', verifyToken, participationsRoutes);
app.use('/api/rankings', verifyToken, rankingRoutes);
app.use('/api/retos', verifyToken,challengesRoutes);
app.use('/api/rankingDetalles', verifyToken,rankingDetalleRoutes);

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