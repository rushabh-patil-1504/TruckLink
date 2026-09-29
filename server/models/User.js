import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['DRIVER', 'COMPANY', 'ADMIN'], default: 'DRIVER' },
    activeRole: { type: String, enum: ['DRIVER', 'COMPANY'], default: 'DRIVER' },
    driverProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'DriverProfile' },
    companyProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'CompanyProfile' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
