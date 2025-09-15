const quizzes = [
    {
        quizIdentifier: "class10",
        title: "Class 10 Aptitude & Interest Quiz",
        questions: [
            { text: "Which activity do you enjoy the most?", options: [{ text: "Solving complex math problems", stream: "Science" }, { text: "Analyzing historical events", stream: "Arts" }, { text: "Understanding how businesses work", stream: "Commerce" }] },
            { text: "What kind of TV shows or movies do you prefer?", options: [{ text: "Science fiction or documentaries", stream: "Science" }, { text: "Dramas or historical films", stream: "Arts" }, { text: "Shows about entrepreneurs or the stock market", stream: "Commerce" }] },
            { text: "If you had to start a club, what would it be?", options: [{ text: "A robotics or coding club", stream: "Science" }, { text: "A debate or literature club", stream: "Arts" }, { text: "An investment or young entrepreneurs club", stream: "Commerce" }] },
            { text: "Which subject combination sounds most interesting?", options: [{ text: "Physics, Chemistry, and Math", stream: "Science" }, { text: "History, Political Science, and Economics", stream: "Arts" }, { text: "Accountancy, Business Studies, and Economics", stream: "Commerce" }] },
            { text: "How do you approach problem-solving?", options: [{ text: "Logically and systematically", stream: "Science" }, { text: "Creatively and with empathy", stream: "Arts" }, { text: "Strategically and with a focus on efficiency", stream: "Commerce" }] },
        ]
    },
    {
        quizIdentifier: "class12-Science",
        title: "Class 12 Science - Career Mapping Quiz",
        questions: [
            { text: "Are you more interested in the theoretical 'why' or the practical 'how'?", options: [{ text: "Theoretical 'why'", field: "Research/Academia" }, { text: "Practical 'how'", field: "Engineering" }] },
            { text: "Do you enjoy building things with your hands or with code?", options: [{ text: "With my hands", field: "Mechanical/Civil Engineering" }, { text: "With code", field: "Computer Science" }] },
            { text: "Are you fascinated by the human body and medicine?", options: [{ text: "Yes, deeply", field: "Medical Field" }, { text: "Not particularly", field: "Non-Medical Fields" }] },
            { text: "Do you prefer working on large-scale projects or intricate systems?", options: [{ text: "Large-scale projects", field: "Civil Engineering" }, { text: "Intricate systems", field: "Electronics/Software" }] },
        ]
    },
    {
        quizIdentifier: "class12-Commerce",
        title: "Class 12 Commerce - Career Mapping Quiz",
        questions: [
            { text: "Are you more interested in managing money or managing people?", options: [{ text: "Managing money", field: "Finance/Accounting" }, { text: "Managing people", field: "Human Resources/Management" }] },
            { text: "Do you enjoy analyzing data to find trends or persuading people?", options: [{ text: "Analyzing data", field: "Data Analysis/Finance" }, { text: "Persuading people", field: "Marketing/Sales" }] },
        ]
    },
    {
        quizIdentifier: "class12-Arts",
        title: "Class 12 Arts - Career Mapping Quiz",
        questions: [
            { text: "Are you more drawn to visual expression or written expression?", options: [{ text: "Visual expression", field: "Design/Fine Arts" }, { text: "Written expression", field: "Journalism/Writing" }] },
            { text: "Do you want to understand societal structures or individual human behavior?", options: [{ text: "Societal structures", field: "Sociology/Civil Services" }, { text: "Individual behavior", field: "Psychology" }] },
        ]
    }
];

module.exports = quizzes;
