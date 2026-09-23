import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5000;

connectDatabase()
  .catch((error) => console.error('MongoDB connection failed:', error.message))
  .finally(() => app.listen(port, () => console.log(`Portfolio API listening on http://localhost:${port}`)));
