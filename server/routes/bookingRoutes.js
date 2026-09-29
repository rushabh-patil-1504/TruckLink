import express from 'express';
import {
  estimatePrice,
  createBooking,
  getBookingDetails
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/estimate-price', estimatePrice);
router.post('/', protect, authorize('COMPANY'), createBooking);
router.get('/:id', protect, getBookingDetails);

export default router;
