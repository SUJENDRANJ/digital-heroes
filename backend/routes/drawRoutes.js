import express from 'express';
import {
  runSimulation,
  publishDraw,
  getLatestDraw
} from '../controllers/drawController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/latest', getLatestDraw);
router.post('/simulate', protect, admin, runSimulation);
router.post('/publish', protect, admin, publishDraw);

export default router;
