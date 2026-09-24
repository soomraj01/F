import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import multer from 'multer';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();
const allowedOrigins = [process.env.CLIENT_ORIGIN, 'https://soomraj-omega.vercel.app', 'http://localhost:5173'].filter(Boolean);

app.use(cors({ origin: (origin, callback) => callback(null, !origin || allowedOrigins.includes(origin)), credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '20mb' }));

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'portfolio-api' }));
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/uploads', uploadRoutes);

// This function keeps API errors readable while avoiding a crashed development server.
app.use((error, _request, response, _next) => {
  console.error(error);
  if (error.type === 'entity.too.large') return response.status(413).json({ message: 'Project images are too large for this upload. Use fewer or smaller images.' });
  if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') return response.status(413).json({ message: 'This image is larger than the 5 MB upload limit.' });
  if (error instanceof multer.MulterError) return response.status(400).json({ message: `Image upload failed: ${error.message}` });
  if (error.message === 'Unexpected field') return response.status(400).json({ message: 'Image upload field is invalid. Please choose the image again.' });
  if (error.name === 'ValidationError') return response.status(400).json({ message: Object.values(error.errors).map((item) => item.message).join(' ') });
  if (error.name === 'MongoServerError' || error.name === 'MongooseError') return response.status(503).json({ message: 'MongoDB could not save this project. Check the database connection and image size.' });
  response.status(500).json({ message: 'Something went wrong on the server.' });
});

export default app;
