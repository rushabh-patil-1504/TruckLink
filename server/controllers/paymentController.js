import Payment from '../models/Payment.js';
import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

// @desc    Process Demo Simulated Payment
// @route   POST /api/payments/process-demo
// @access  Private (Company)
export const processDemoPayment = async (req, res) => {
  try {
    const { bookingId, amount, paymentMethod } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to make payment for this booking' });
    }

    const transactionId = `TXN-DEMO-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const payment = await Payment.create({
      booking: booking._id,
      company: req.user._id,
      amount: amount || booking.price,
      paymentMethod: paymentMethod || 'DEMO_CARD',
      transactionId,
      status: 'SUCCESS'
    });

    booking.paymentStatus = 'SUCCESS';
    booking.payment = payment._id;
    await booking.save();

    // Create Notification for Driver
    const notification = await Notification.create({
      recipient: booking.driver,
      title: 'Payment Received! 💳',
      message: `Payment of ₹${booking.price.toLocaleString('en-IN')} for booking #${booking.bookingNumber} has been received.`,
      type: 'PAYMENT',
      link: `/driver/bookings`
    });

    // Broadcast Real-Time Socket Event to Driver
    const io = req.app.get('io');
    if (io) {
      io.to(`user_${booking.driver}`).emit('notification_received', notification);
      io.to(`user_${booking.driver}`).emit('booking_status_changed', {
        bookingId: booking._id,
        paymentStatus: 'SUCCESS',
        booking
      });
    }

    res.status(201).json({
      message: 'DEMO PAYMENT SUCCESSFUL! Payment record logged in MongoDB.',
      payment,
      transactionId
    });
  } catch (error) {
    console.error('[Demo Payment Error]', error);
    res.status(500).json({ message: error.message });
  }
};
