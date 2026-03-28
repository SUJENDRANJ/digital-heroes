import Charity from '../models/Charity.js';

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
export const getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({});
    res.json({ success: true, count: charities.length, charities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a charity
// @route   POST /api/charities
// @access  Private/Admin
export const createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);
    res.status(201).json({ success: true, charity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a charity
// @route   PUT /api/charities/:id
// @access  Private/Admin
export const updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    res.json({ success: true, charity });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a charity
// @route   DELETE /api/charities/:id
// @access  Private/Admin
export const deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findById(req.params.id);

    if (!charity) {
      return res.status(404).json({ success: false, message: 'Charity not found' });
    }

    await charity.deleteOne();
    res.json({ success: true, message: 'Charity removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
