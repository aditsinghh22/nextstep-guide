const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');

// @route   GET /api/quizzes/:level/:stream?
// @desc    Get quiz questions based on level and optionally stream
// @access  Public
router.get('/:level/:stream?', async (req, res) => {
    try {
        const { level, stream } = req.params;
        
        // Base query is always on the 'level' (class10 or class12)
        let query = { level: level };

        // If the level is class12, we also need to filter by the stream (Science, Arts, etc.)
        if (stream && level === 'class12') {
            query.stream = stream;
        }

        // Find the single quiz document that matches our query
        const quiz = await Quiz.findOne(query);

        // If no quiz is found, return a 404 Not Found error
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz not found for this level/stream' });
        }

        // Send the found quiz data back to the frontend
        res.json(quiz);
    } catch (err) {
        // If any other error occurs, log it and send a server error response
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

