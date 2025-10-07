// backend/models/Seat.js
import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },        // e.g. 1–25
  date: { type: String, required: true },              // YYYY-MM-DD
  location: { type: String, default: "Main Floor" },
  
});

// ✅ Make seatNumber + date unique so we can have same seat numbers on different days
seatSchema.index({ seatNumber: 1, date: 1 }, { unique: true });

export default mongoose.model("Seat", seatSchema);
