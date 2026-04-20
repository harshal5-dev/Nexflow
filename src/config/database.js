import mongoose from 'mongoose';
import config from './index.js';

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoDB.uri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export { connectDB };
