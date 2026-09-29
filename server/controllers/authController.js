import User from '../models/User.js';
import DriverProfile from '../models/DriverProfile.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Truck from '../models/Truck.js';
import { generateToken } from '../middleware/authMiddleware.js';

// @desc    Register a new Driver or Company Owner
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { role, email, mobile, password, name } = req.body;

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or mobile already exists' });
    }

    // Create Base User
    const user = new User({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      role: role || 'DRIVER',
      activeRole: role || 'DRIVER'
    });

    if (role === 'DRIVER') {
      const {
        truckNumber,
        registrationNumber,
        truckType,
        capacityTons,
        experienceYears,
        baseCity,
        preferredRoutes,
        materialTypesAccepted,
        availabilityStatus
      } = req.body;

      await user.save();

      // Create Truck
      const truck = await Truck.create({
        driver: user._id,
        truckNumber: truckNumber || `GJ-${Math.floor(10 + Math.random() * 89)}-AB-${Math.floor(1000 + Math.random() * 8999)}`,
        registrationNumber: registrationNumber || `IND-${Math.floor(100000 + Math.random() * 899999)}`,
        truckType: truckType || 'Medium Truck',
        capacityTons: capacityTons || 10
      });

      // Create Driver Profile
      const driverProfile = await DriverProfile.create({
        user: user._id,
        truck: truck._id,
        experienceYears: experienceYears || 3,
        baseCity: baseCity || 'Surat',
        preferredRoutes: preferredRoutes || ['Surat - Mumbai', 'Ahmedabad - Vadodara'],
        materialTypesAccepted: materialTypesAccepted || ['Textiles', 'General Cargo', 'Industrial Goods'],
        availabilityStatus: availabilityStatus || 'AVAILABLE'
      });

      user.driverProfile = driverProfile._id;
      await user.save();
    } else {
      // Company Owner Signup
      const {
        companyName,
        contactPerson,
        businessType,
        gstNumber,
        companyAddress,
        city,
        state
      } = req.body;

      await user.save();

      const companyProfile = await CompanyProfile.create({
        user: user._id,
        companyName: companyName || `${name}'s Enterprises`,
        contactPerson: contactPerson || name,
        businessType: businessType || 'Manufacturer',
        gstNumber: gstNumber || '24AAAAA0000A1Z5',
        companyAddress: companyAddress || 'Ring Road, Textile Market',
        city: city || 'Surat',
        state: state || 'Gujarat'
      });

      user.companyProfile = companyProfile._id;
      await user.save();
    }

    const populatedUser = await User.findById(user._id)
      .select('-password')
      .populate({
        path: 'driverProfile',
        populate: { path: 'truck' }
      })
      .populate('companyProfile');

    res.status(201).json({
      token: generateToken(user._id),
      user: populatedUser
    });
  } catch (error) {
    console.error('[Register Error]', error);
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

// @desc    Login user with email/mobile and password
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier = email or mobile

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Please provide email/mobile and password' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { mobile: identifier.trim() }
      ]
    })
      .populate({
        path: 'driverProfile',
        populate: { path: 'truck' }
      })
      .populate('companyProfile');

    if (user && (await user.matchPassword(password))) {
      res.json({
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          activeRole: user.activeRole,
          driverProfile: user.driverProfile,
          companyProfile: user.companyProfile,
          avatar: user.avatar
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials. Please check your username/email or password.' });
    }
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};

// @desc    Get Current Logged in User Profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate({
        path: 'driverProfile',
        populate: { path: 'truck' }
      })
      .populate('companyProfile');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Switch user active role (Driver <-> Company)
// @route   POST /api/auth/switch-role
// @access  Private
export const switchRole = async (req, res) => {
  try {
    const { targetRole } = req.body;
    const user = await User.findById(req.user._id)
      .populate('driverProfile')
      .populate('companyProfile');

    if (targetRole === 'COMPANY' && !user.companyProfile) {
      return res.status(400).json({
        hasProfile: false,
        message: "You don't have a Company Owner profile yet."
      });
    }

    if (targetRole === 'DRIVER' && !user.driverProfile) {
      return res.status(400).json({
        hasProfile: false,
        message: "You don't have a Driver profile yet."
      });
    }

    user.activeRole = targetRole;
    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate({ path: 'driverProfile', populate: { path: 'truck' } })
      .populate('companyProfile');

    res.json({
      message: `Successfully switched active role to ${targetRole}`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create missing profile for cross-role switching
// @route   POST /api/auth/create-linked-profile
// @access  Private
export const createLinkedProfile = async (req, res) => {
  try {
    const { role } = req.body; // 'DRIVER' or 'COMPANY'
    const user = await User.findById(req.user._id);

    if (role === 'COMPANY') {
      if (user.companyProfile) {
        return res.status(400).json({ message: 'Company profile already exists' });
      }

      const { companyName, contactPerson, businessType, city, state } = req.body;
      const companyProfile = await CompanyProfile.create({
        user: user._id,
        companyName: companyName || `${user.name} Logistics Co.`,
        contactPerson: contactPerson || user.name,
        businessType: businessType || 'Manufacturer',
        city: city || 'Surat',
        state: state || 'Gujarat'
      });

      user.companyProfile = companyProfile._id;
      user.activeRole = 'COMPANY';
      await user.save();
    } else if (role === 'DRIVER') {
      if (user.driverProfile) {
        return res.status(400).json({ message: 'Driver profile already exists' });
      }

      const { truckNumber, truckType, capacityTons, baseCity } = req.body;
      const truck = await Truck.create({
        driver: user._id,
        truckNumber: truckNumber || `GJ-05-TR-${Math.floor(1000 + Math.random() * 8999)}`,
        registrationNumber: `IND-${Math.floor(100000 + Math.random() * 899999)}`,
        truckType: truckType || 'Medium Truck',
        capacityTons: capacityTons || 10
      });

      const driverProfile = await DriverProfile.create({
        user: user._id,
        truck: truck._id,
        experienceYears: 3,
        baseCity: baseCity || 'Surat',
        availabilityStatus: 'AVAILABLE'
      });

      user.driverProfile = driverProfile._id;
      user.activeRole = 'DRIVER';
      await user.save();
    }

    const updatedUser = await User.findById(user._id)
      .select('-password')
      .populate({ path: 'driverProfile', populate: { path: 'truck' } })
      .populate('companyProfile');

    res.json({
      message: `Created and linked ${role} profile!`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
