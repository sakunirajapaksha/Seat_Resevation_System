// config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Loads .env file variables into process.env

/**
 * Connect to MongoDB
 * This function is imported and called in server.js
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Stop the app if DB connection fails
  }
};

export default connectDB;
