import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  switchRole,
  createLinkedProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/switch-role', protect, switchRole);
router.post('/create-linked-profile', protect, createLinkedProfile);

export default router;
