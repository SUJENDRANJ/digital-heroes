import mongoose from 'mongoose';

const drawSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  },
  winningNumbers: [{
    type: Number,
    min: 1,
    max: 45
  }],
  totalPool: {
    type: Number,
    required: true,
    default: 0
  },
  jackpotRollover: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['simulated', 'published'],
    default: 'simulated'
  }
}, {
  timestamps: true
});

// Compound index to ensure only one draw per month/year
drawSchema.index({ month: 1, year: 1 }, { unique: true });

const Draw = mongoose.model('Draw', drawSchema);
export default Draw;
