const express = require('express');
const router = express.Router();
const College = require('../models/College');

// @route   GET /api/colleges
// @desc    Get all colleges from the database
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Find all documents in the College collection
        const colleges = await College.find();
        // Send the list of colleges as a JSON response
        res.json(colleges);
    } catch (err) {
        // If an error occurs, log it and send a server error response
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/colleges/:id
// @desc    Get a single college by its unique ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // Find a single college by the ID provided in the URL parameter
        const college = await College.findById(req.params.id);

        // If no college is found with that ID, return a 404 Not Found error
        if (!college) {
            return res.status(404).json({ msg: 'College not found' });
        }
        
        // If the college is found, send it as a JSON response
        res.json(college);
    } catch (err) {
        // If an error occurs (like an invalid ID format), log it and send a server error response
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// This line makes the router available to be used in your main server.js file
module.exports = router;

