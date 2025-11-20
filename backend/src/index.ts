import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';
import { initDatabase } from './config/database';
import { initRedis } from './config/redis';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigin = frontendUrl.startsWith('http') ? frontendUrl : `https://${frontendUrl}`;

app.use(cors({
  origin: allowedOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
setupRoutes(app);

// Inicializar servicios
async function startServer() {
  try {
    // Inicializar PostgreSQL
    await initDatabase();
    console.log('✅ PostgreSQL conectado');

    // Inicializar Redis
    await initRedis();
    console.log('✅ Redis conectado');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

startServer();
