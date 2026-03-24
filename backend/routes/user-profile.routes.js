const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   GET /api/user-profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await User.findById(req.user.id).select('-password');
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Error in GET /me:', err.message);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

// @route   PUT /api/user-profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, async (req, res) => {
  try {
    const {
      businessName,
      location,
      bio,
      phoneNumber,
      whatsappNumber,
      yearsOfExperience,
      specialization,
      skills,
      secondarySkills,
      expertise
    } = req.body;
    
    const profile = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          businessName,
          location,
          bio,
          phoneNumber,
          whatsappNumber,
          yearsOfExperience,
          specialization,
          skills,
          secondarySkills,
          expertise,
          isProfileComplete: true
        }
      },
      { new: true }
    ).select('-password');
    
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Error in PUT /:', err.message);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
});

module.exports = router;
