import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { initializeDataSource } from './database/data-source';
import tripRouter from './routes/trip.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor Express con TypeScript funcionando 🚀');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use('/api/trips', tripRouter);

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