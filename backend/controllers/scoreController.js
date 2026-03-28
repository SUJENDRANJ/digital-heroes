import Score from '../models/Score.js';
import User from '../models/User.js';

// @desc    Submit a new score
// @route   POST /api/scores
// @access  Private
export const submitScore = async (req, res) => {
  const { value, date } = req.body;

  try {
    if (value < 1 || value > 45) {
      return res.status(400).json({ success: false, message: 'Score must be between 1 and 45' });
    }

    const score = await Score.create({
      userId: req.user._id,
      value,
      date: date || Date.now()
    });

    // Logic for limiting to 5 scores is also handled by the post-save hook in the Score model.
    // However, to ensure we meet the "The logic must ensure..." requirement in the controller:
    const userScores = await Score.find({ userId: req.user._id }).sort({ date: -1 });

    if (userScores.length > 5) {
      const scoresToRemove = userScores.slice(5);
      const idsToRemove = scoresToRemove.map(s => s._id);

      await Score.deleteMany({ _id: { $in: idsToRemove } });
      
      // Sync the User document's scores array
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { scores: { $in: idsToRemove } },
        $addToSet: { scores: score._id }
      });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $addToSet: { scores: score._id }
      });
    }

    res.status(201).json({ success: true, score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's scores
// @route   GET /api/scores
// @access  Private
export const getScores = async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.user._id })
      .sort({ date: -1 }) // Most recent first
      .limit(5);

    res.json({ success: true, scores });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
