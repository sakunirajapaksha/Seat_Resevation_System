import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load .env

// Create a function to generate token
export function generateToken(user) {
  // user: an object like { id: "12345", email: "test@example.com" }
  return jwt.sign(
    { id: user.id, email: user.email },        // Payload
    process.env.JWT_SECRET,                    // Secret key
    { expiresIn: process.env.JWT_EXPIRES }     // Options
  );
}

// Example usage (for testing in terminal)
const sampleUser = { id: "12345", email: "test@example.com" };
const token = generateToken(sampleUser);
console.log("Generated JWT Token:\n", token);
