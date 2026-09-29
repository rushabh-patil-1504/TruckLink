import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/trucklink';
  try {
    // Try standard MongoDB connection first
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    console.log(`[MongoDB] Connected to local instance: ${conn.connection.host}:${conn.connection.port}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Local MongoDB connection failed (${error.message}). Booting Embedded MongoDB Memory Server...`);
    try {
      mongoMemoryInstance = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryInstance.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`[MongoDB] Connected to Embedded MongoDB Memory Server at: ${memoryUri}`);
    } catch (memError) {
      console.error(`[MongoDB Error] Failed to boot MongoMemoryServer: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
