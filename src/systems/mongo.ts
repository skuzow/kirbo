import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectDB() {
  await mongoose
    .connect(config.MONGO_URI ?? '')
    .then(() => console.log('Connected to MongoDB'))
    .catch((e) => {
      console.error('There was an error connecting to MongoDB');
      console.error(e);
      process.exit();
    });
}
