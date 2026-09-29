import express from 'express';
import { processDemoPayment } from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/process-demo', protect, authorize('COMPANY'), processDemoPayment);

export default router;
