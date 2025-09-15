const express = require('express');
const router = express.Router();
const Mentor = require('../models/Mentor');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/mentors
// @desc    Get all bookable mentor profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const mentors = await Mentor.find().populate('user', ['name', 'email']);
        res.json(mentors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/mentors
// @desc    Create or update a mentor profile for the logged-in user
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
    const { college, field, availability } = req.body;

    const mentorFields = {
        user: req.user.id,
        college,
        field,
        availability
    };

    try {
        let mentor = await Mentor.findOne({ user: req.user.id });

        // Update
        if (mentor) {
            mentor = await Mentor.findOneAndUpdate(
                { user: req.user.id },
                { $set: mentorFields },
                { new: true }
            );
            return res.json(mentor);
        }

        // Create
        mentor = new Mentor(mentorFields);
        await mentor.save();

        // Also update the user's role to 'mentor'
        await User.findByIdAndUpdate(req.user.id, { userType: 'mentor' });
        
        res.json(mentor);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

