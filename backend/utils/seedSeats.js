// backend/utils/seedSeats.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Seat from "../models/Seat.js";

dotenv.config();

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("Connected to MongoDB, seeding seats...");

  // Drop the collection if it exists
  await mongoose.connection.db
    .dropCollection("seats")
    .catch(err => {
      if (err.code === 26) {
        console.log("Collection 'seats' does not exist, continuing...");
      } else {
        throw err;
      }
    });

  // Create 50 seats
  const seats = [];
  for (let i = 1; i <= 50; i++) {
    seats.push({
      seatNumber: i,
      location: "Main Office",
      amenities: []
    });
  }

  await Seat.insertMany(seats);
  console.log("✅ 50 seats seeded successfully.");

  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
