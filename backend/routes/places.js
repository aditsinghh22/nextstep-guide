// --- PASTE THIS ENTIRE CODE INTO backend/routes/places.js ---

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to build the photo URL safely
const getPhotoUrl = (photoReference) => {
    if (!photoReference) {
        return null;
    }
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${photoReference}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
};

// ROUTE 1: For searching colleges in a location
router.get('/colleges', async (req, res) => {
    const { location } = req.query;
    if (!location) {
        return res.status(400).json({ msg: 'Location query is required' });
    }

    // This line is the critical fix. Make sure it's present.
    const fields = 'place_id,name,photos,formatted_address,rating,user_ratings_total';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=colleges in ${location}&fields=${fields}&key=${process.env.GOOGLE_PLACES_API_KEY}`;

    try {
        const response = await axios.get(url);
        
        const formattedResults = response.data.results.map(place => {
            const photoReference = (place.photos && place.photos.length > 0) 
                ? place.photos[0].photo_reference 
                : null;

            return {
                id: place.place_id,
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                totalRatings: place.user_ratings_total,
                photoUrl: getPhotoUrl(photoReference)
            };
        });

        res.json(formattedResults);
    } catch (error) {
        console.error("Error fetching colleges from Google:", error.message);
        res.status(500).send('Server Error while fetching from Google API');
    }
});


// ROUTE 2: For getting details of a single college
router.get('/details', async (req, res) => {
    const { placeId } = req.query;
    if (!placeId) {
        return res.status(400).json({ msg: 'placeId query is required' });
    }

    const fields = 'name,place_id,formatted_address,website,rating,user_ratings_total,reviews,photos';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fields}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    try {
        const response = await axios.get(url);
        const place = response.data.result;
        
        const photoReference = (place.photos && place.photos.length > 0) 
            ? place.photos[0].photo_reference 
            : null;
            
        const formattedResult = {
            id: place.place_id,
            name: place.name,
            location: place.formatted_address,
            website: place.website,
            rating: place.rating,
            reviews: place.reviews,
            photoUrl: getPhotoUrl(photoReference),
            // Adding sample data as your frontend expects it
            specialty: 'Multidisciplinary',
            courses: ['Computer Science', 'Business Admin', 'Arts & Humanities', 'Law', 'Medical Prep']
        };

        res.json(formattedResult);
    } catch (error) {
        console.error("Error fetching college details from Google:", error.message);
        res.status(500).send('Server Error while fetching from Google API');
    }
});

module.exports = router;