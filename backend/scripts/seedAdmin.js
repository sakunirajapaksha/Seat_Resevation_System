import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";

dotenv.config();

const SALT_ROUNDS = 10;

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("Set MONGO_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_URI);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const existing = await User.findOne({ email: adminEmail.toLowerCase() });
  if (existing) {
    console.log("Admin already exists:", adminEmail);
    process.exit(0);
  }

  const hash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  const admin = new User({
    firstName: "Admin",
    lastName: "User",
    email: adminEmail.toLowerCase(),
    passwordHash: hash,
    role: "admin",
    university: "N/A"
  });

  await admin.save();
  console.log("Admin user created:", adminEmail);
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
