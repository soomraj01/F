import app from '../src/app.js';
import { connectDatabase } from '../src/config/db.js';

let databaseReady;

// This function connects once per serverless instance before handling an API request.
export default async function handler(request, response) {
  databaseReady ||= connectDatabase().catch((error) => console.error('MongoDB connection failed:', error.message));
  await databaseReady;
  return app(request, response);
}