import mongoose from 'mongoose';

const checkpointSchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    note: { type: String, default: '' },
    isCompleted: { type: Boolean, default: true }
  },
  { _id: true }
);

export default checkpointSchema;
