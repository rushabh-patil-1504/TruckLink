import DriverProfile from '../models/DriverProfile.js';
import Availability from '../models/Availability.js';
import Booking from '../models/Booking.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Payment from '../models/Payment.js';

// @desc    Get all available drivers for companies to book
// @route   GET /api/companies/available-drivers
// @access  Private (Company)
export const getAvailableDrivers = async (req, res) => {
  try {
    const {
      origin,
      destination,
      truckType,
      capacity,
      material,
      minRating,
      search
    } = req.query;

    let query = {
      availabilityStatus: { $in: ['AVAILABLE', 'BUSY'] }
    };

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (truckType) {
      // Find drivers with matching truck
    }

    let drivers = await DriverProfile.find(query)
      .populate({
        path: 'user',
        select: 'name email mobile avatar'
      })
      .populate('truck');

    // Filter by route / material / search if specified
    if (origin || destination || material || search || capacity || truckType) {
      drivers = drivers.filter((dp) => {
        let match = true;
        const route = dp.currentRoute || {};
        const truck = dp.truck || {};

        if (origin && route.origin) {
          match = match && route.origin.toLowerCase().includes(origin.toLowerCase());
        }
        if (destination && route.destination) {
          match = match && route.destination.toLowerCase().includes(destination.toLowerCase());
        }
        if (material && route.materialType) {
          match = match && route.materialType.toLowerCase().includes(material.toLowerCase());
        }
        if (truckType && truck.truckType) {
          match = match && truck.truckType.toLowerCase().includes(truckType.toLowerCase());
        }
        if (capacity && truck.capacityTons) {
          match = match && truck.capacityTons >= parseFloat(capacity);
        }
        if (search) {
          const s = search.toLowerCase();
          const nameMatch = dp.user?.name?.toLowerCase().includes(s);
          const cityMatch = dp.baseCity?.toLowerCase().includes(s);
          const routeMatch = (route.origin + ' ' + route.destination).toLowerCase().includes(s);
          const truckMatch = truck.truckNumber?.toLowerCase().includes(s);
          match = match && (nameMatch || cityMatch || routeMatch || truckMatch);
        }
        return match;
      });
    }

    res.json(drivers);
  } catch (error) {
    console.error('[Get Available Drivers Error]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Company Dashboard Overview
// @route   GET /api/companies/dashboard
// @access  Private (Company)
export const getCompanyDashboard = async (req, res) => {
  try {
    const companyProfile = await CompanyProfile.findOne({ user: req.user._id });
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const activeBookingsCount = await Booking.countDocuments({
      company: req.user._id,
      status: { $in: ['CONFIRMED', 'ACTIVE'] }
    });

    const pendingRequestsCount = await Booking.countDocuments({
      company: req.user._id,
      status: 'PENDING'
    });

    const completedBookingsCount = await Booking.countDocuments({
      company: req.user._id,
      status: 'COMPLETED'
    });

    const availableDriversCount = await DriverProfile.countDocuments({
      availabilityStatus: 'AVAILABLE'
    });

    // Calculate total spent
    const payments = await Payment.find({ company: req.user._id, status: 'SUCCESS' });
    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    const activeBookings = await Booking.find({
      company: req.user._id,
      status: { $in: ['CONFIRMED', 'ACTIVE'] }
    })
      .populate('driver', 'name mobile email')
      .populate('driverProfile')
      .populate('truck')
      .sort({ createdAt: -1 });

    res.json({
      companyProfile,
      activeBookingsCount,
      pendingRequestsCount,
      completedBookingsCount,
      availableDriversCount,
      totalSpent,
      activeBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Company Bookings
// @route   GET /api/companies/bookings
// @access  Private (Company)
export const getCompanyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ company: req.user._id })
      .populate('driver', 'name mobile email')
      .populate('driverProfile')
      .populate('truck')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
