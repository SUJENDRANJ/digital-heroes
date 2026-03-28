import express from 'express';
import { submitScore, getScores } from '../controllers/scoreController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, submitScore)
  .get(protect, getScores);

export default router;
