// File: backend/routes/user.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

router.put('/profile', auth, async (req, res) => {
    try {
        const { bookmarks, quizHistory, sessions } = req.body;

        const updatedFields = {};
        if (bookmarks !== undefined) updatedFields.bookmarks = bookmarks;
        if (quizHistory !== undefined) updatedFields.quizHistory = quizHistory;
        if (sessions !== undefined) updatedFields.sessions = sessions;

        // Ensure we handle cases where no updatable fields are sent
        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ msg: 'No fields to update' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        res.json(user);

    } catch (err) {
        // This will now log the specific error in your backend terminal
        console.error("ERROR IN /api/user/profile:", err.message); 
        res.status(500).send('Server Error');
    }
});

module.exports = router;