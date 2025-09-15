// This script is now smarter. It creates colleges first, then creates users and mentors,
// and finally finds the correct college to add the mentor's review to.
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Load models
const College = require('./models/College');
const Mentor = require('./models/Mentor');
const Quiz = require('./models/Quiz');
const User = require('./models/User');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

console.log('MongoDB Connected for Seeding...');

// Read JSON files
const colleges = require('./data/colleges');
const mentorsAndReviews = require('./data/mentors');
const quizzes = require('./data/quizzes');

// Import data into DB
const importData = async () => {
    try {
        console.log('Clearing existing data...');
        await Promise.all([
            College.deleteMany(),
            Mentor.deleteMany(),
            Quiz.deleteMany(),
            User.deleteMany()
        ]);
        console.log('Existing data cleared...');

        console.log('Importing Quizzes...');
        await Quiz.insertMany(quizzes);
        console.log('Quizzes Imported...');

        console.log('Importing Colleges...');
        await College.insertMany(colleges);
        console.log('Colleges Imported...');

        console.log('Creating Users, Mentors, and Reviews...');
        // This loop processes each mentor/review, creates a user, creates a mentor profile if bookable,
        // and adds their review to the correct college.
        for (const item of mentorsAndReviews) {
            // 1. Create a user for every mentor/reviewer
            const user = await User.create({
                name: item.name,
                email: `${item.name.replace(/\s+/g, '.').toLowerCase()}@example.com`,
                password: 'password123', // Default password for seeded data
                userType: 'mentor'
            });

            // 2. Create a bookable mentor profile if they have availability info
            if (item.availability) {
                await Mentor.create({
                    user: user._id,
                    name: item.name,
                    college: item.college,
                    field: item.field,
                    image: item.image,
                    availability: item.availability,
                    rating: item.rating,
                    reviewCount: item.reviews // This is reviewCount in mock data
                });
            }

            // 3. Find the college they belong to and add their review
            const collegeToUpdate = await College.findOne({ name: item.college });
            if (collegeToUpdate) {
                const review = {
                    authorId: user._id,
                    name: item.name,
                    status: item.status,
                    branch: item.branch,
                    qualifications: item.qualifications,
                    achievements: item.achievements,
                    reviewType: item.reviewType,
                    reviewTitle: item.reviewTitle,
                    reviewText: item.reviewText,
                    image: item.image,
                };
                collegeToUpdate.reviews.push(review);
                await collegeToUpdate.save();
            } else {
                 console.log(`Could not find college "${item.college}" for mentor "${item.name}"`);
            }
        }
        console.log('Users, Mentors, and Reviews created successfully!');

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};


// Destroy data from DB
const destroyData = async () => {
    try {
        await Promise.all([
            College.deleteMany(),
            Mentor.deleteMany(),
            Quiz.deleteMany(),
            User.deleteMany()
        ]);
        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}