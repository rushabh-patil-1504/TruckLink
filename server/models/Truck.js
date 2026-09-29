import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    truckNumber: { type: String, required: true, uppercase: true, trim: true },
    registrationNumber: { type: String, required: true, uppercase: true, trim: true },
    truckType: {
      type: String,
      enum: ['Mini Truck', 'Light Commercial Vehicle', 'Medium Truck', 'Heavy Truck', 'Trailer', 'Other'],
      required: true
    },
    capacityTons: { type: Number, required: true },
    makeModel: { type: String, default: 'Tata 1613 / Eicher Pro' },
    isVerified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Truck = mongoose.model('Truck', truckSchema);
export default Truck;
