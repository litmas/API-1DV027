const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }

    // Validate connection string format
    if (process.env.MONGO_URI.includes('mongodb+srv://') && process.env.MONGO_URI.includes(':27017')) {
      throw new Error('mongodb+srv URI cannot have port number');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error('Database connection error:', err.message);
    process.exit(1);
  }
};

// (Rest of your db.js remains the same)
