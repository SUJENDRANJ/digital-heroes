import express from 'express';
import {
  getCharities,
  createCharity,
  updateCharity,
  deleteCharity
} from '../controllers/charityController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getCharities)
  .post(protect, admin, createCharity);

router.route('/:id')
  .put(protect, admin, updateCharity)
  .delete(protect, admin, deleteCharity);

export default router;
