import express from 'express';
import {
  setAvailability,
  getDriverDashboard,
  getDriverBookings,
  respondToBookingRequest
} from '../controllers/driverController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('DRIVER'));

router.post('/availability', setAvailability);
router.get('/dashboard', getDriverDashboard);
router.get('/bookings', getDriverBookings);
router.put('/bookings/:id/respond', respondToBookingRequest);

export default router;
