import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  value: {
    type: Number,
    required: [true, 'Score value is required'],
    min: [1, 'Stableford score must be at least 1'],
    max: [45, 'Stableford score cannot exceed 45']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Middleware to maintain only the latest 5 scores for a user
scoreSchema.post('save', async function(doc) {
  const User = mongoose.model('User');
  const Score = mongoose.model('Score');

  // Find all scores for this user, sorted by date descending
  const userScores = await Score.find({ userId: doc.userId }).sort({ date: -1 });

  if (userScores.length > 5) {
    // Identify scores to remove (everything after the 5th)
    const scoresToRemove = userScores.slice(5);
    const idsToRemove = scoresToRemove.map(s => s._id);

    // Delete from Score collection
    await Score.deleteMany({ _id: { $in: idsToRemove } });

    // Update User's scores array
    await User.findByIdAndUpdate(doc.userId, {
      $pull: { scores: { $in: idsToRemove } }
    });
  }

  // Update User's scores array with the current score if not already present
  await User.findByIdAndUpdate(doc.userId, {
    $addToSet: { scores: doc._id }
  });
});

const Score = mongoose.model('Score', scoreSchema);
export default Score;
