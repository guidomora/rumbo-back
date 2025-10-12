import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // 👈 importá CORS
import { initializeDataSource } from './database/data-source';
import tripRouter from './routes/trip.routes';
import userRouter from './routes/user.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ habilitar CORS antes de las rutas
app.use(
  cors({
    origin: ['http://localhost:3001'], // frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor Express con TypeScript funcionando 🚀');
});

// ✅ tus rutas después del middleware
app.use('/api/trips', tripRouter);
app.use('/api/users', userRouter);

const startServer = async () => {
  try {
    await initializeDataSource();
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible inicializar la base de datos:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  void startServer();
}

export default app;