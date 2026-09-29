import express from 'express';
import { submitReview, getDriverReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/driver/:driverId', getDriverReviews);
router.post('/', protect, authorize('COMPANY'), submitReview);

export default router;
