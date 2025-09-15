const mongoose = require('mongoose');

// Function to connect to the MongoDB database
const connectDB = async () => {
  try {
    // Attempt to connect using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with failure
    process.exit(1);
  }
};

// This is the crucial line that makes the function available to other files.
module.exports = connectDB;