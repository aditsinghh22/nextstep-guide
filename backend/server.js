// --- PASTE THIS ENTIRE CODE INTO backend/server.js ---

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Require your other files
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// --- CORS CONFIGURATION ---
// This is the critical fix. It tells your backend to accept requests
// from your local machine and your future live frontend.
const whitelist = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://nextstep-guide.netlify.app",
  "https://nextstep-guide.vercel.app",
  "https://nextstepguide.me",
  "https://www.nextstepguide.me"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));




// --- END OF CORS CONFIGURATION ---


// Body parser middleware
app.use(express.json());

// --- Mount all routers here ---
app.get('/', (req, res) => res.send('API is Running...'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/places', require('./routes/places'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));