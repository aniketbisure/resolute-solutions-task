import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/studentRoutes';

const app = express();

app.use(cors({
  origin: [
    'https://resolute-solutions-task.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));
app.use(express.json());

app.use('/api', studentRoutes);

export default app;
