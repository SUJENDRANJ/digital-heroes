import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  drawId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Draw',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tier: {
    type: Number,
    enum: [3, 4, 5],
    required: true
  },
  prizeAmount: {
    type: Number,
    required: true
  },
  proofImageUrl: {
    type: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const Winner = mongoose.model('Winner', winnerSchema);
export default Winner;
