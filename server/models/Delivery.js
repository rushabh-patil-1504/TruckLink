import mongoose from 'mongoose';
import checkpointSchema from './Checkpoint.js';

const deliverySchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['NOT_STARTED', 'IN_TRANSIT', 'COMPLETED'],
      default: 'NOT_STARTED'
    },
    currentLocation: { type: String, default: 'Pickup Point' },
    checkpoints: [checkpointSchema],
    startTime: { type: Date },
    completionTime: { type: Date }
  },
  { timestamps: true }
);

const Delivery = mongoose.model('Delivery', deliverySchema);
export default Delivery;
