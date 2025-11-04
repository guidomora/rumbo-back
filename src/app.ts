import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { initializeDataSource } from './database/data-source';
import tripRouter from './routes/trip.routes';
import userRouter from './routes/user.routes';
import emailRouter from './routes/email.route';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Servidor Express con TypeScript funcionando 🚀');
});

app.use('/api/trips', tripRouter);
app.use('/api/users', userRouter);
app.use('/api/email', emailRouter);

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