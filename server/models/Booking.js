import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: { type: String, required: true, unique: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile', required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    driverProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DriverProfile', required: true },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
    pickupLocation: { type: String, required: true, trim: true },
    destinationLocation: { type: String, required: true, trim: true },
    pickupDate: { type: Date, required: true },
    expectedDeliveryDate: { type: Date, required: true },
    materialType: { type: String, required: true },
    weightTons: { type: Number, required: true },
    truckType: { type: String, required: true },
    price: { type: Number, required: true },
    specialInstructions: { type: String, default: '' },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'],
      default: 'PENDING'
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
