import mongoose from 'mongoose';

const serviceLocationSchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true, trim: true },
    region: { type: String, enum: ['GUJARAT', 'REST_OF_INDIA'], default: 'REST_OF_INDIA' },
    isHub: { type: Boolean, default: false },
    coordinates: {
      lat: { type: Number, default: 22.3072 },
      lng: { type: Number, default: 73.1812 }
    },
    activeDriversCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const ServiceLocation = mongoose.model('ServiceLocation', serviceLocationSchema);
export default ServiceLocation;
