import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DriverProfile', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    originCity: { type: String, required: true, trim: true },
    destinationCity: { type: String, required: true, trim: true },
    availableFrom: { type: Date, required: true },
    availableUntil: { type: Date, required: true },
    materialTypes: [{ type: String }],
    maxWeightTons: { type: Number, required: true },
    truckType: { type: String, required: true },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
