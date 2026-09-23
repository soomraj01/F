import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import { connectDatabase } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'portfolio-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// This function keeps API errors readable while avoiding a crashed development server.
app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

connectDatabase()
  .catch((error) => console.error('MongoDB connection failed:', error.message))
  .finally(() => app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`)));
