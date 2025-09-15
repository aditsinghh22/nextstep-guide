const express = require('express');
const router = express.Router();
const { Client } = require('@googlemaps/google-maps-services-js');

const client = new Client({});

// @route   GET /api/places/colleges
// @desc    Search for colleges in a location
// @access  Public
router.get('/colleges', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ msg: 'Location query is required' });
    }
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ msg: 'Google API key not configured' });
    }

    try {
        const response = await client.textSearch({
            params: {
                query: `colleges in ${location}`,
                key: apiKey,
            },
        });

        const formattedColleges = response.data.results.map(place => ({
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating,
            totalRatings: place.user_ratings_total,
            photoUrl: place.photos && place.photos.length > 0
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
                : `https://placehold.co/600x400/131314/ffffff?text=${encodeURIComponent(place.name)}`
        }));
        res.json(formattedColleges);

    } catch (err) {
        console.error('Google Places Text Search Error:', err.message);
        res.status(500).send('Server Error fetching from Google');
    }
});

// --- UPDATED DETAILS ROUTE BELOW ---

// @route   GET /api/places/details
// @desc    Get detailed information for a specific place using its Place ID
// @access  Public
router.get('/details', async (req, res) => {
    const { placeId } = req.query;
    if (!placeId) {
        return res.status(400).json({ msg: 'Place ID is required' });
    }
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ msg: 'Google API key not configured' });
    }

    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                fields: ['name', 'formatted_address', 'website', 'rating', 'user_ratings_total', 'reviews', 'photos'],
                key: apiKey,
            },
        });

        const details = response.data.result;
        
        // --- THIS IS THE NEW LOGIC ---
        // We now process the data here and build the photo URL on the backend
        const formattedDetails = {
            id: placeId,
            name: details.name,
            location: details.formatted_address,
            website: details.website,
            rating: details.rating,
            reviews: details.reviews || [],
            image: details.photos && details.photos.length > 0
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${details.photos[0].photo_reference}&key=${apiKey}`
                : `https://placehold.co/1200x600/131314/ffffff?text=${encodeURIComponent(details.name)}`,
            // Add default values for fields Google doesn't provide
            specialty: 'University / College',
            courses: ['B.Tech', 'M.Tech', 'B.Sc', 'M.Sc', 'Ph.D'],
        };
        
        res.json(formattedDetails);

    } catch (err) {
        console.error('Google Place Details Error:', err.message);
        res.status(500).send('Server Error fetching details from Google');
    }
});

module.exports = router;