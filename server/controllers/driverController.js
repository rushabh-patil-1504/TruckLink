import DriverProfile from '../models/DriverProfile.js';
import Availability from '../models/Availability.js';
import Booking from '../models/Booking.js';
import Delivery from '../models/Delivery.js';
import Truck from '../models/Truck.js';
import Notification from '../models/Notification.js';

// @desc    Set/Post Driver Fleet Availability
// @route   POST /api/drivers/availability
// @access  Private (Driver)
export const setAvailability = async (req, res) => {
  try {
    const {
      originCity,
      destinationCity,
      availableFrom,
      availableUntil,
      materialTypes,
      maxWeightTons,
      truckType,
      notes,
      availabilityStatus
    } = req.body;

    const driverProfile = await DriverProfile.findOne({ user: req.user._id }).populate('truck');
    if (!driverProfile) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const status = availabilityStatus || 'AVAILABLE';

    // Update current route in profile
    driverProfile.availabilityStatus = status;
    driverProfile.currentRoute = {
      origin: originCity || '',
      destination: destinationCity || '',
      availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
      availableUntil: availableUntil ? new Date(availableUntil) : new Date(Date.now() + 86400000 * 3),
      maxWeightTons: maxWeightTons || driverProfile.truck?.capacityTons || 10,
      materialType: Array.isArray(materialTypes) ? materialTypes.join(', ') : materialTypes || 'General Cargo',
      truckType: truckType || driverProfile.truck?.truckType || 'Medium Truck',
      notes: notes || ''
    };

    await driverProfile.save();

    let availabilityRecord = null;
    if (status === 'AVAILABLE') {
      availabilityRecord = await Availability.create({
        driver: req.user._id,
        driverProfile: driverProfile._id,
        truck: driverProfile.truck?._id,
        originCity: originCity || 'Surat',
        destinationCity: destinationCity || 'Mumbai',
        availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
        availableUntil: availableUntil ? new Date(availableUntil) : new Date(Date.now() + 86400000 * 3),
        materialTypes: Array.isArray(materialTypes) ? materialTypes : [materialTypes || 'General Cargo'],
        maxWeightTons: maxWeightTons || driverProfile.truck?.capacityTons || 10,
        truckType: truckType || driverProfile.truck?.truckType || 'Medium Truck',
        notes: notes || '',
        isActive: true
      });
    }

    // Broadcast live update via Socket.IO if app instance attached
    const io = req.app.get('io');
    if (io) {
      io.emit('availability_updated', {
        driverId: req.user._id,
        driverName: req.user.name,
        status: driverProfile.availabilityStatus,
        currentRoute: driverProfile.currentRoute
      });
    }

    res.json({
      message: 'Availability updated successfully!',
      driverProfile,
      availabilityRecord
    });
  } catch (error) {
    console.error('[Set Availability Error]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Driver Operations Dashboard Overview
// @route   GET /api/drivers/dashboard
// @access  Private (Driver)
export const getDriverDashboard = async (req, res) => {
  try {
    const driverProfile = await DriverProfile.findOne({ user: req.user._id }).populate('truck');
    if (!driverProfile) {
      return res.status(404).json({ message: 'Driver profile not found' });
    }

    const totalBookings = await Booking.countDocuments({ driver: req.user._id });
    const pendingBookings = await Booking.countDocuments({ driver: req.user._id, status: 'PENDING' });
    const completedDeliveries = await Booking.countDocuments({ driver: req.user._id, status: 'COMPLETED' });
    const activeBooking = await Booking.findOne({
      driver: req.user._id,
      status: { $in: ['CONFIRMED', 'ACTIVE'] }
    }).populate('companyProfile');

    let activeDelivery = null;
    if (activeBooking) {
      activeDelivery = await Delivery.findOne({ booking: activeBooking._id });
    }

    res.json({
      availabilityStatus: driverProfile.availabilityStatus,
      currentRoute: driverProfile.currentRoute,
      truck: driverProfile.truck,
      rating: driverProfile.rating,
      totalReviews: driverProfile.totalReviews,
      totalBookings,
      pendingBookings,
      completedDeliveries,
      totalDistanceKm: driverProfile.totalDistanceKm || 1240,
      activeBooking,
      activeDelivery
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Driver incoming booking requests & history
// @route   GET /api/drivers/bookings
// @access  Private (Driver)
export const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('company', 'name email mobile')
      .populate('companyProfile')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or Reject a booking request
// @route   PUT /api/drivers/bookings/:id/respond
// @access  Private (Driver)
export const respondToBookingRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'ACCEPT' or 'REJECT'
    const booking = await Booking.findById(req.params.id)
      .populate('company')
      .populate('companyProfile');

    if (!booking) {
      return res.status(404).json({ message: 'Booking request not found' });
    }

    if (booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to respond to this booking' });
    }

    const driverProfile = await DriverProfile.findOne({ user: req.user._id });

    if (action === 'ACCEPT') {
      booking.status = 'CONFIRMED';
      driverProfile.availabilityStatus = 'BUSY';
      await driverProfile.save();

      // Create Delivery object with initial checkpoint (Pickup Point)
      let delivery = await Delivery.findOne({ booking: booking._id });
      if (!delivery) {
        delivery = await Delivery.create({
          booking: booking._id,
          driver: req.user._id,
          company: booking.company._id,
          status: 'NOT_STARTED',
          currentLocation: booking.pickupLocation,
          checkpoints: [
            {
              cityName: booking.pickupLocation,
              timestamp: new Date(),
              note: 'Booking Confirmed - Pickup Point Designated',
              isCompleted: true
            }
          ]
        });
      }

      await booking.save();

      // Create notification for company
      const notification = await Notification.create({
        recipient: booking.company._id,
        title: 'Booking Accepted! 🚚',
        message: `Driver ${req.user.name} accepted your shipment from ${booking.pickupLocation} to ${booking.destinationLocation}.`,
        type: 'BOOKING',
        link: `/company/deliveries`
      });

      // Socket.IO real-time notification to company
      const io = req.app.get('io');
      if (io) {
        io.to(`user_${booking.company._id}`).emit('booking_status_changed', {
          bookingId: booking._id,
          status: 'CONFIRMED',
          booking
        });
        io.to(`user_${booking.company._id}`).emit('notification_received', notification);
        io.emit('availability_updated', {
          driverId: req.user._id,
          driverName: req.user.name,
          status: 'BUSY'
        });
      }
    } else {
      booking.status = 'REJECTED';
      await booking.save();

      const notification = await Notification.create({
        recipient: booking.company._id,
        title: 'Booking Request Declined',
        message: `Driver ${req.user.name} declined your booking request for ${booking.pickupLocation} to ${booking.destinationLocation}.`,
        type: 'BOOKING',
        link: `/company/bookings`
      });

      const io = req.app.get('io');
      if (io) {
        io.to(`user_${booking.company._id}`).emit('booking_status_changed', {
          bookingId: booking._id,
          status: 'REJECTED',
          booking
        });
        io.to(`user_${booking.company._id}`).emit('notification_received', notification);
      }
    }

    res.json({ message: `Booking ${action === 'ACCEPT' ? 'accepted' : 'rejected'} successfully`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
