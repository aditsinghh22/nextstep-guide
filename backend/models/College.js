const mongoose = require('mongoose');

// NEW: This schema will be embedded inside the College model
const ReviewSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    name: String,
    status: String,
    branch: String,
    qualifications: String,
    achievements: String,
    reviewType: {
        type: String,
        enum: ['positive', 'negative'],
    },
    reviewTitle: String,
    reviewText: String,
    image: String,
});

const CollegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: String,
    exams: [String],
    rating: Number,
    type: String,
    image: String,
    specialty: String,
    courses: [String],
    reviews: [ReviewSchema] // This will hold all reviews for the college
}, {
    timestamps: true,
});

module.exports = mongoose.model('College', CollegeSchema);