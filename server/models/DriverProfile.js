import mongoose from 'mongoose';

const driverProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    experienceYears: { type: Number, required: true, default: 3 },
    baseCity: { type: String, required: true, trim: true },
    preferredRoutes: [{ type: String }],
    materialTypesAccepted: [{ type: String }],
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'AVAILABLE'
    },
    currentRoute: {
      origin: { type: String, default: '' },
      destination: { type: String, default: '' },
      availableFrom: { type: Date },
      availableUntil: { type: Date },
      maxWeightTons: { type: Number },
      materialType: { type: String },
      truckType: { type: String },
      notes: { type: String }
    },
    rating: { type: Number, default: 5.0 },
    totalReviews: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    totalDistanceKm: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const DriverProfile = mongoose.model('DriverProfile', driverProfileSchema);
export default DriverProfile;
