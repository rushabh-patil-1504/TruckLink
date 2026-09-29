import Review from '../models/Review.js';
import Booking from '../models/Booking.js';
import DriverProfile from '../models/DriverProfile.js';
import CompanyProfile from '../models/CompanyProfile.js';

// @desc    Submit Driver Review after completed delivery
// @route   POST /api/reviews
// @access  Private (Company)
export const submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    const booking = await Booking.findById(bookingId).populate('driverProfile');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.company.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    const companyProfile = await CompanyProfile.findOne({ user: req.user._id });

    // Check existing review
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already submitted a review for this booking' });
    }

    const review = await Review.create({
      booking: booking._id,
      company: req.user._id,
      companyName: companyProfile ? companyProfile.companyName : req.user.name,
      driver: booking.driver,
      driverProfile: booking.driverProfile._id,
      rating: parseFloat(rating),
      comment: comment || 'Great logistics service and on-time delivery.',
      deliveryRoute: `${booking.pickupLocation} → ${booking.destinationLocation}`
    });

    booking.review = review._id;
    await booking.save();

    // Recalculate Driver Average Rating in MongoDB
    const allDriverReviews = await Review.find({ driverProfile: booking.driverProfile._id });
    const totalRatingSum = allDriverReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = (totalRatingSum / allDriverReviews.length).toFixed(1);

    const driverProfile = await DriverProfile.findById(booking.driverProfile._id);
    if (driverProfile) {
      driverProfile.rating = parseFloat(avgRating);
      driverProfile.totalReviews = allDriverReviews.length;
      await driverProfile.save();
    }

    res.status(201).json({
      message: 'Thank you! Driver review submitted successfully.',
      review,
      newDriverRating: avgRating
    });
  } catch (error) {
    console.error('[Submit Review Error]', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Reviews for a Driver
// @route   GET /api/reviews/driver/:driverId
// @access  Public / Private
export const getDriverReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ driver: req.params.driverId })
      .populate('company', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
