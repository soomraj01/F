import mongoose from 'mongoose';

// This function connects to MongoDB when a connection string is configured.
export async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    console.log('MONGODB_URI is not configured; using the in-memory project store.');
    return false;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');
  return true;
}
