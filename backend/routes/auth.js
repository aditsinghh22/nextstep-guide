// --- PASTE THIS ENTIRE CODE INTO backend/routes/auth.js ---

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const auth = require('../middleware/auth'); // Make sure you have this middleware

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to create a consistent and correct token payload
const createTokenPayload = (user) => {
    return {
        user: {
            id: user._id,
        }
    };
};

// === SIGNUP ROUTE ===
// File: backend/routes/auth.js

// === SIGNUP ROUTE ===
// File: backend/routes/auth.js

// REPLACE your '/register' route with this test version
// File: backend/routes/auth.js

// REPLACE the test code with this final '/register' route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user && user.isVerified) {
            return res.status(400).json({ msg: 'User with this email already exists' });
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        if (user) { // If user exists but is not verified, update them
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else { // Otherwise, create a new user
            user = new User({ name, email, password: hashedPassword, otp, otpExpires });
            await user.save();
        }

        // This is the part that sends the email
        await transporter.sendMail({
            from: `"NextStepGuide" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Verification Code',
            html: `<h3>Welcome to NextStepGuide!</h3><p>Your OTP is: <h1>${otp}</h1></p><p>It will expire in 10 minutes.</p>`,
        });

        res.status(200).json({ msg: 'OTP sent to your email. Please verify.' });

    } catch (err) {
        console.error("ERROR IN REGISTER ROUTE:", err);
        res.status(500).send('Server Error: Could not send verification email.');
    }
});

// === VERIFY OTP ROUTE ===
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;
    try {
        let user = await User.findOne({ email });

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: 'OTP is invalid or has expired.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const payload = createTokenPayload(user);
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            // FIXED: Return both token and the full user object (minus password)
            const userToReturn = { ...user.toObject() };
            delete userToReturn.password;
            res.status(200).json({ token, user: userToReturn });
        });

    } catch (err) {
        console.error("ERROR IN VERIFY ROUTE:", err.message);
        res.status(500).send('Server Error');
    }
});

// === STANDARD LOGIN ROUTE ===
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        if (!user.isVerified) {
            return res.status(400).json({ msg: 'Account not verified. Please check your email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = createTokenPayload(user);
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            // FIXED: Return both token and the full user object (minus password)
            const userToReturn = { ...user.toObject() };
            delete userToReturn.password;
            res.json({ token, user: userToReturn });
        });
    } catch (err) {
        console.error("ERROR IN LOGIN ROUTE:", err.message);
        res.status(500).send('Server Error');
    }
});

// === GOOGLE LOGIN ROUTE ===
router.post('/google', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ name, email, isVerified: true, provider: 'google' });
            await user.save(); // This line is correct from our previous fix
        }

        const payload = createTokenPayload(user);
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            // FIXED: Return both token and the full user object (minus password)
            const userToReturn = { ...user.toObject() };
            delete userToReturn.password;
            res.json({ token, user: userToReturn });
        });
    } catch (err) {
        console.error('ERROR IN GOOGLE LOGIN:', err.message);
        res.status(500).send('Server Error');
    }
});


// === GET USER PROFILE ROUTE (for page reloads) ===
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error("ERROR in /api/auth/me:", err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;