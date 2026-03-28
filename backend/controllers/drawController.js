import Draw from '../models/Draw.js';
import User from '../models/User.js';
import Winner from '../models/Winner.js';
import { calculatePrizePool, generateWinningNumbers } from '../utils/drawEngine.js';

// @desc    Run a draw simulation
// @route   POST /api/draws/simulate
// @access  Private/Admin
export const runSimulation = async (req, res) => {
  const { mode } = req.body; // 'random' or 'algorithmic'

  try {
    const totalPool = await calculatePrizePool();
    const winningNumbers = await generateWinningNumbers(mode);

    // Fetch last published draw for potential rollover
    const lastDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    const prevRollover = lastDraw ? lastDraw.jackpotRollover : 0;

    const simulation = await calculateMatches(winningNumbers, totalPool, prevRollover);

    res.json({
      success: true,
      winningNumbers,
      totalPool,
      prevRollover,
      ...simulation
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Officially publish a draw
// @route   POST /api/draws/publish
// @access  Private/Admin
export const publishDraw = async (req, res) => {
  const { mode, month, year } = req.body;

  try {
    // Check if draw already published for this month
    const existingDraw = await Draw.findOne({ month, year, status: 'published' });
    if (existingDraw) {
      return res.status(400).json({ success: false, message: 'Draw already published for this month/year' });
    }

    const totalPool = await calculatePrizePool();
    const winningNumbers = await generateWinningNumbers(mode);

    // Fetch last published draw for rollover
    const lastDraw = await Draw.findOne({ status: 'published' }).sort({ createdAt: -1 });
    const prevRollover = lastDraw ? lastDraw.jackpotRollover : 0;

    const results = await calculateMatches(winningNumbers, totalPool, prevRollover);

    // Create the Draw record
    const draw = await Draw.create({
      month,
      year,
      winningNumbers,
      totalPool,
      jackpotRollover: results.rolloverForNextMonth,
      status: 'published'
    });

    // Create Winner records
    const winnerPromises = [];
    results.tiers.forEach(tier => {
      tier.winners.forEach(w => {
        winnerPromises.push(Winner.create({
          drawId: draw._id,
          userId: w.userId,
          tier: tier.matchCount,
          prizeAmount: tier.prizePerWinner
        }));
      });
    });

    await Promise.all(winnerPromises);

    res.status(201).json({ success: true, draw, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get the latest published draw
// @route   GET /api/draws/latest
// @access  Public
export const getLatestDraw = async (req, res) => {
  try {
    const draw = await Draw.findOne({ status: 'published' })
      .sort({ createdAt: -1 });

    if (!draw) {
      return res.status(404).json({ success: false, message: 'No draws found' });
    }

    // Include winners (summary or list)
    const winners = await Winner.find({ drawId: draw._id })
      .populate('userId', 'email');

    res.json({ success: true, draw, winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Shared logic to find matches and calculate prize splits.
 */
async function calculateMatches(winningNumbers, pool, prevRollover) {
  const winSet = new Set(winningNumbers);
  
  // Find all active users and their scores
  const activeUsers = await User.find({ subscriptionStatus: 'active' }).populate('scores');
  
  const results = {
    tiers: [
      { matchCount: 5, share: 0.40, winners: [], totalPrize: 0, prizePerWinner: 0 },
      { matchCount: 4, share: 0.35, winners: [], totalPrize: 0, prizePerWinner: 0 },
      { matchCount: 3, share: 0.25, winners: [], totalPrize: 0, prizePerWinner: 0 }
    ],
    rolloverForNextMonth: 0
  };

  // Find matches for each user
  activeUsers.forEach(user => {
    if (!user.scores || user.scores.length === 0) return;

    // We match against the set of unique scores the user has among their latest 5
    const userScoreValues = new Set(user.scores.map(s => s.value));
    let matchCount = 0;
    userScoreValues.forEach(val => {
      if (winSet.has(val)) matchCount++;
    });

    if (matchCount >= 3) {
      const tier = results.tiers.find(t => t.matchCount === Math.min(matchCount, 5));
      if (tier) {
        tier.winners.push({ userId: user._id, email: user.email });
      }
    }
  });

  // Calculate prize splits
  results.tiers.forEach(tier => {
    let tierPool = pool * tier.share;
    
    // Add rollover to 5-match tier
    if (tier.matchCount === 5) {
      tierPool += prevRollover;
    }

    tier.totalPrize = tierPool;

    if (tier.winners.length > 0) {
      tier.prizePerWinner = tierPool / tier.winners.length;
    } else if (tier.matchCount === 5) {
      // If no 5-match winners, the entire tier pool (including prev rollover) rolls over
      results.rolloverForNextMonth = tierPool;
    }
  });

  return results;
}
