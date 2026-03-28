import User from '../models/User.js';

// @desc    Initiate a subscription (Stripe mock)
// @route   POST /api/subscriptions/checkout
// @access  Private
export const createCheckoutSession = async (req, res) => {
  const { plan } = req.body; // e.g., 'monthly', 'yearly'

  try {
    // In a real app, integrate Stripe here. For now, returning success and mock URL.
    res.status(200).json({
      success: true,
      message: 'Redirect to checkout...',
      checkoutUrl: `https://checkout.stripe.com/mock-session-${req.user._id}`,
      plan
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user subscription status (Webhook mock)
// @route   PATCH /api/subscriptions/status
// @access  Private (or Webhook secret verification)
export const updateSubscriptionStatus = async (req, res) => {
  const { status } = req.body; // e.g., 'active', 'inactive', 'canceled'

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.subscriptionStatus = status;
    await user.save();

    res.json({ success: true, message: `Subscription status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
