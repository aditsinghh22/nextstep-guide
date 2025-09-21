// File: backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    // ... (name, email, password fields remain the same) ...
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },

    // --- ADD THESE NEW FIELDS ---
    otp: { type: String },
    otpExpires: { type: Date },
    isVerified: { type: Boolean, default: false }, // Good to track verified users
    // --- END OF NEW FIELDS ---
    
    bookmarks: { type: [String], default: [] },
    quizHistory: { type: [Object], default: [] },
    sessions: { type: [Object], default: [] },
    googleId: { type: String },
    avatar: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('user', UserSchema);