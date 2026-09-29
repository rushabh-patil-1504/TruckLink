import express from 'express';
import {
  getAvailableDrivers,
  getCompanyDashboard,
  getCompanyBookings
} from '../controllers/companyController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('COMPANY'));

router.get('/available-drivers', getAvailableDrivers);
router.get('/dashboard', getCompanyDashboard);
router.get('/bookings', getCompanyBookings);

export default router;
