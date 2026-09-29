import Booking from '../models/Booking.js';
import DriverProfile from '../models/DriverProfile.js';
import CompanyProfile from '../models/CompanyProfile.js';
import Truck from '../models/Truck.js';
import Notification from '../models/Notification.js';
import Delivery from '../models/Delivery.js';

// @desc    Calculate Estimated Freight Pricing (DEMO Algorithm)
// @route   POST /api/bookings/estimate-price
// @access  Public / Private
export const estimatePrice = async (req, res) => {
  try {
    const { pickupLocation, destinationLocation, weightTons, truckType, materialType } = req.body;

    // Base fare + distance estimation rate
    const baseFare = 3500; // Base INR rate
    const tonRate = (weightTons || 10) * 450; // Rate per ton

    // Distance factor (Simulated based on common Gujarat/India city pairs)
    let distanceKm = 280; // default estimated distance
    const routeKey = `${pickupLocation}-${destinationLocation}`.toLowerCase();

    if (routeKey.includes('surat') && routeKey.includes('mumbai')) distanceKm = 280;
    else if (routeKey.includes('ahmedabad') && routeKey.includes('mumbai')) distanceKm = 530;
    else if (routeKey.includes('ahmedabad') && routeKey.includes('vadodara')) distanceKm = 110;
    else if (routeKey.includes('surat') && routeKey.includes('ahmedabad')) distanceKm = 265;
    else if (routeKey.includes('rajkot') && routeKey.includes('ahmedabad')) distanceKm = 215;
    else if (routeKey.includes('delhi') && routeKey.includes('mumbai')) distanceKm = 1400;
    else if (routeKey.includes('bengaluru') && routeKey.includes('chennai')) distanceKm = 350;

    const perKmRate = 28;
    const estimatedDistanceFare = distanceKm * perKmRate;

    // Truck Type multiplier
    let truckMultiplier = 1.0;
    if (truckType === 'Heavy Truck') truckMultiplier = 1.35;
    else if (truckType === 'Trailer') truckMultiplier = 1.6;
    else if (truckType === 'Mini Truck') truckMultiplier = 0.7;

    const totalPrice = Math.round((baseFare + tonRate + estimatedDistanceFare) * truckMultiplier);

    res.json({
      estimatedPrice: totalPrice,
      currency: 'INR (₹)',
      breakdown: {
        baseFare,
        tonnageCharge: tonRate,
        estimatedDistanceKm: distanceKm,
        distanceFare: estimatedDistanceFare,
        truckMultiplier
      },
      disclaimer: 'DEMO ESTIMATION: Price is calculated dynamically based on simulated route distance, capacity, and truck type.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new Booking Request from Company to Driver
// @route   POST /api/bookings
// @access  Private (Company)
export const createBooking = async (req, res) => {
  try {
    const {
      driverId,
      pickupLocation,
      destinationLocation,
      pickupDate,
      expectedDeliveryDate,
      materialType,
      weightTons,
      truckType,
      specialInstructions
    } = req.body;

    const companyProfile = await CompanyProfile.findOne({ user: req.user._id });
    if (!companyProfile) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    const driverProfile = await DriverProfile.findOne({ user: driverId }).populate('truck');
    if (!driverProfile) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    // Calculate Price
    const baseFare = 3500;
    const tonRate = (parseFloat(weightTons) || 10) * 450;
    const perKmRate = 28;
    let distanceKm = 300;
    const totalPrice = Math.round((baseFare + tonRate + (distanceKm * perKmRate)));

    // Generate unique booking number
    const bookingNumber = `TL-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    const booking = await Booking.create({
      bookingNumber,
      company: req.user._id,
      companyProfile: companyProfile._id,
      driver: driverId,
      driverProfile: driverProfile._id,
      truck: driverProfile.truck?._id,
      pickupLocation,
      destinationLocation,
      pickupDate: pickupDate ? new Date(pickupDate) : new Date(),
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : new Date(Date.now() + 86400000 * 2),
      materialType,
      weightTons: parseFloat(weightTons) || 10,
      truckType: truckType || driverProfile.truck?.truckType || 'Medium Truck',
      price: totalPrice,
      specialInstructions: specialInstructions || '',
      status: 'PENDING',
      paymentStatus: 'PENDING'
    });

    // Send Notification to Driver
    const notification = await Notification.create({
      recipient: driverId,
      title: 'New Booking Request! 📦',
      message: `${companyProfile.companyName} requested a shipment from ${pickupLocation} to ${destinationLocation} (${weightTons} Tons).`,
      type: 'BOOKING',
      link: `/driver/requests`
    });

    // Real-time Socket.IO dispatch to Driver
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${driverId}`).emit('new_booking_request', {
        bookingId: booking._id,
        booking,
        notification
      });
      io.to(`user_${driverId}`).emit('notification_received', notification);
    }

    res.status(201).json({
      message: 'Booking request sent to driver successfully!',
      booking
    });
  } catch (error) {
    console.error('[Create Booking Error]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Booking Details by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('company', 'name email mobile')
      .populate('companyProfile')
      .populate('driver', 'name email mobile')
      .populate('driverProfile')
      .populate('truck')
      .populate('payment')
      .populate('review');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const delivery = await Delivery.findOne({ booking: booking._id });

    res.json({ booking, delivery });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
