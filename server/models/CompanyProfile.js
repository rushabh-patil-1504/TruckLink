import mongoose from 'mongoose';

const companyProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    businessType: {
      type: String,
      enum: ['Manufacturer', 'Retailer', 'Wholesaler', 'Distributor', 'E-commerce', 'Other'],
      default: 'Manufacturer'
    },
    gstNumber: { type: String, trim: true, default: '24AAAAA0000A1Z5' },
    companyAddress: { type: String, default: '' },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    totalBookings: { type: Number, default: 0 },
    completedShipments: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);
export default CompanyProfile;
