import express from 'express';
import {
  getDeliveryByBooking,
  addCheckpoint
} from '../controllers/deliveryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/booking/:bookingId', getDeliveryByBooking);
router.post('/:id/checkpoint', authorize('DRIVER'), addCheckpoint);

export default router;
