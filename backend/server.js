const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // You'll need this to allow your React app to talk to the backend
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors()); // This allows requests from your React app (which runs on a different port)

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/colleges', require('./routes/colleges'));
app.use('/api/mentors', require('./routes/mentors'));
app.use('/api/quizzes', require('./routes/quizzes'));
app.use('/api/places', require('./routes/places')); // <-- THIS IS THE NEW LINE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

