const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    stream: String, // For class 10
    field: String,  // For class 12
});

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [OptionSchema],
});

const QuizSchema = new mongoose.Schema({
    quizIdentifier: {
        type: String,
        required: true,
        unique: true, // e.g., 'class10' or 'class12-Science'
    },
    title: {
        type: String,
        required: true,
    },
    questions: [QuestionSchema],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Quiz', QuizSchema);

