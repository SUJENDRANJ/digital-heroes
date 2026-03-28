import User from '../models/User.js';
import Score from '../models/Score.js';

/**
 * Calculates the total prize pool based on active subscribers.
 * For this implementation, we'll assume a fixed $10 contribution per active user.
 */
export const calculatePrizePool = async () => {
  const activeUserCount = await User.countDocuments({ subscriptionStatus: 'active' });
  const CONTRIBUTION_PER_USER = 10; // This could be moved to an environment variable or config
  return activeUserCount * CONTRIBUTION_PER_USER;
};

/**
 * Generates 5 unique winning numbers between 1 and 45.
 * @param {string} mode - 'random' or 'algorithmic'
 */
export const generateWinningNumbers = async (mode = 'random') => {
  if (mode === 'random') {
    return generateRandomNumbers(5, 1, 45);
  }

  if (mode === 'algorithmic') {
    // Weighted based on frequency of user scores
    const scores = await Score.aggregate([
      { $group: { _id: '$value', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Create a pool where numbers appearing more frequently have a higher chance
    // Or conversely, less frequent (the PRD says most/least frequent, so we'll use a mix or configurable logic)
    // Here we'll implement a simple weight: more frequent scores are more likely to be picked
    let pool = [];
    scores.forEach(s => {
      // Add number to pool 'count' times
      for (let i = 0; i < s.count; i++) {
        pool.push(s._id);
      }
    });

    // Fill the rest of the 1-45 range if they haven't been entered yet to ensure variety
    for (let i = 1; i <= 45; i++) {
      pool.push(i);
    }

    const winningNumbers = new Set();
    while (winningNumbers.size < 5) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      winningNumbers.add(pool[randomIndex]);
    }

    return Array.from(winningNumbers);
  }

  return generateRandomNumbers(5, 1, 45);
};

const generateRandomNumbers = (count, min, max) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }
  return Array.from(numbers);
};
