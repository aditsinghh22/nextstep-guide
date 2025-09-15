const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
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

const MentorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    college: {
        type: String,
        required: true,
    },
    field: {
        type: String,
        required: true,
    },
    image: String,
    availability: {
        days: [String],
        time: String,
    },
    reviews: [ReviewSchema],
    rating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Mentor', MentorSchema);

