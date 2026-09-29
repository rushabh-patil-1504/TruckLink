import Delivery from '../models/Delivery.js';
import Booking from '../models/Booking.js';
import DriverProfile from '../models/DriverProfile.js';
import Notification from '../models/Notification.js';

// @desc    Get Active Delivery Details & Checkpoint Timeline
// @route   GET /api/deliveries/booking/:bookingId
// @access  Private
export const getDeliveryByBooking = async (req, res) => {
  try {
    let delivery = await Delivery.findOne({ booking: req.params.bookingId })
      .populate({
        path: 'booking',
        populate: [
          { path: 'company', select: 'name mobile email' },
          { path: 'companyProfile' },
          { path: 'driver', select: 'name mobile email' },
          { path: 'driverProfile' },
          { path: 'truck' }
        ]
      });

    if (!delivery) {
      // Fallback create if missing
      const booking = await Booking.findById(req.params.bookingId);
      if (!booking) return res.status(404).json({ message: 'Booking not found' });

      delivery = await Delivery.create({
        booking: booking._id,
        driver: booking.driver,
        company: booking.company,
        status: 'IN_TRANSIT',
        currentLocation: booking.pickupLocation,
        checkpoints: [
          {
            cityName: booking.pickupLocation,
            timestamp: new Date(),
            note: 'Goods Loaded & Trip Started',
            isCompleted: true
          }
        ]
      });

      delivery = await Delivery.findById(delivery._id).populate({
        path: 'booking',
        populate: [{ path: 'companyProfile' }, { path: 'driverProfile' }, { path: 'truck' }]
      });
    }

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add Manual Delivery Checkpoint (Driver Action)
// @route   POST /api/deliveries/:id/checkpoint
// @access  Private (Driver)
export const addCheckpoint = async (req, res) => {
  try {
    const { cityName, note, isFinalDestination } = req.body;
    const delivery = await Delivery.findById(req.params.id).populate('booking');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }

    if (delivery.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update checkpoints for this delivery' });
    }

    // Add checkpoint
    const newCheckpoint = {
      cityName: cityName || 'Midway Transit Point',
      timestamp: new Date(),
      note: note || `Reached ${cityName}`,
      isCompleted: true
    };

    delivery.checkpoints.push(newCheckpoint);
    delivery.currentLocation = cityName;
    delivery.status = 'IN_TRANSIT';

    if (delivery.booking.status === 'CONFIRMED') {
      delivery.booking.status = 'ACTIVE';
      await delivery.booking.save();
    }

    if (isFinalDestination || cityName.toLowerCase() === delivery.booking.destinationLocation.toLowerCase()) {
      delivery.status = 'COMPLETED';
      delivery.completionTime = new Date();
      delivery.booking.status = 'COMPLETED';
      await delivery.booking.save();

      // Free up Driver Availability
      const driverProfile = await DriverProfile.findOne({ user: req.user._id });
      if (driverProfile) {
        driverProfile.availabilityStatus = 'AVAILABLE';
        driverProfile.completedDeliveries = (driverProfile.completedDeliveries || 0) + 1;
        await driverProfile.save();
      }
    }

    await delivery.save();

    // Create Notification for Company
    const notification = await Notification.create({
      recipient: delivery.company,
      title: isFinalDestination ? 'Shipment Delivered! 🎉' : `Checkpoint Update: ${cityName} 📍`,
      message: isFinalDestination
        ? `Driver ${req.user.name} completed shipment to ${cityName}. Please process payment & leave a review!`
        : `Truck reached checkpoint ${cityName}. Note: "${note || 'In transit'}"`,
      type: 'CHECKPOINT',
      link: `/company/deliveries`
    });

    // Broadcast Real-time Socket.IO Checkpoint event
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${delivery.company}`).emit('checkpoint_added', {
        deliveryId: delivery._id,
        currentLocation: cityName,
        checkpoint: newCheckpoint,
        checkpoints: delivery.checkpoints,
        status: delivery.status,
        bookingStatus: delivery.booking.status
      });

      io.to(`user_${delivery.company}`).emit('notification_received', notification);
    }

    res.json({
      message: `Checkpoint ${cityName} added successfully!`,
      delivery
    });
  } catch (error) {
    console.error('[Add Checkpoint Error]', error);
    res.status(500).json({ message: error.message });
  }
};
