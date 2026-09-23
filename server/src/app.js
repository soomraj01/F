import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';

const app = express();
const allowedOrigins = [process.env.CLIENT_ORIGIN, 'https://soomraj-omega.vercel.app', 'http://localhost:5173'].filter(Boolean);

app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)), credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'portfolio-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);

// This function keeps API errors readable while avoiding a crashed development server.
app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.type === 'entity.too.large') return response.status(413).json({ message: 'Project images are too large for this upload. Use fewer or smaller images.' });
  if (error.name === 'ValidationError') return response.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(' ') });
  if (error.name === 'MongoServerError' || error.name === 'MongooseError') return response.status(503).json({ message: 'MongoDB could not save this project. Check the database connection and image size.' });
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

export default app;
