const jwt = require('jsonwebtoken');

// This function is our "gatekeeper" for protected routes.
// It will run before the main logic of any route it's applied to.
const authMiddleware = (req, res, next) => {
    // 1. Get token from the request header
    // When the frontend sends a request, it should include the token in a header
    // like this: 'x-auth-token': 'the_long_jwt_token_string'
    const token = req.header('x-auth-token');

    // 2. Check if no token is provided
    if (!token) {
        // If there's no token, the user is not authenticated.
        // We send a 401 Unauthorized status and stop processing the request.
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Verify the token if it exists
    try {
        // jwt.verify() will check if the token is valid and hasn't expired.
        // It uses our secret key from the .env file to do this.
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // If verification is successful, the 'decoded' object will contain the
        // original payload (e.g., { user: { id: 'some_user_id' } }).
        // We attach this user information to the request object.
        req.user = decoded.user;

        // We call next() to pass control to the next function in the chain
        // (which is the actual route handler in files like mentors.js or auth.js).
        next();
    } catch (err) {
        // If jwt.verify() fails (because the token is invalid, tampered with, or expired),
        // it will throw an error. We catch it and send a 401 status.
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

