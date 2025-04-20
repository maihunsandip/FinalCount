const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { birthdate, country, gender, height, weight, lifestyle } = req.body;

    user.profile = {
      birthdate: birthdate || user.profile?.birthdate,
      country: country || user.profile?.country,
      gender: gender || user.profile?.gender,
      height: height || user.profile?.height,
      weight: weight || user.profile?.weight,
      lifestyle: {
        smoker: lifestyle?.smoker ?? user.profile?.lifestyle?.smoker ?? false,
        drinker: lifestyle?.drinker ?? user.profile?.lifestyle?.drinker ?? false,
        regularExercise: lifestyle?.regularExercise ?? user.profile?.lifestyle?.regularExercise ?? false,
        healthyDiet: lifestyle?.healthyDiet ?? user.profile?.lifestyle?.healthyDiet ?? false
      }
    };

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate life expectancy
router.get('/life-expectancy', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || !user.profile.birthdate) {
      return res.status(400).json({ message: 'Profile information incomplete' });
    }

    // Calculate base life expectancy
    let lifeExpectancy = 80; // Base life expectancy

    // Adjust based on lifestyle factors
    if (user.profile.lifestyle) {
      if (user.profile.lifestyle.smoker) lifeExpectancy -= 10;
      if (user.profile.lifestyle.drinker) lifeExpectancy -= 5;
      if (user.profile.lifestyle.regularExercise) lifeExpectancy += 3;
      if (user.profile.lifestyle.healthyDiet) lifeExpectancy += 3;
    }

    // Calculate days lived
    const birthDate = new Date(user.profile.birthdate);
    const today = new Date();
    const daysLived = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalDays = lifeExpectancy * 365;
    const daysRemaining = totalDays - daysLived;
    const percentCompleted = (daysLived / totalDays) * 100;

    res.json({
      lifeExpectancy,
      daysLived,
      daysRemaining,
      percentCompleted
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
