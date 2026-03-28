import express from 'express';
import {
  createCheckoutSession,
  updateSubscriptionStatus
} from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/checkout', protect, createCheckoutSession);
router.patch('/status', protect, updateSubscriptionStatus);

export default router;
