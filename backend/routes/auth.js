import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();
const router = express.Router();
const SALT_ROUNDS = 10;

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

/* =========================
   SEED ADMIN (runs on server start)
========================= */
export async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  if (!email) return;
  let admin = await User.findOne({ email });
  if (!admin) {
    const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, SALT_ROUNDS);
    admin = await User.create({
      firstName: "System",
      lastName: "Admin",
      email,
      passwordHash: hash,
      role: "admin"
    });
    console.log("✅ Admin seeded:", email);
  } else if (admin.role !== "admin") {
    admin.role = "admin";
    await admin.save();
    console.log("✅ Admin role updated for", email);
  }
}

/* =========================
   REGISTER  (intern only)
========================= */
router.post(
  "/register",
  [
    body("firstName").trim().notEmpty(),
    body("lastName").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { firstName, lastName, email, password } = req.body;
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ message: "Email already registered" });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        passwordHash: hash,
        role: "intern"
      });

      const token = signToken(user);
      res.status(201).json({ token, user: { id: user._id, role: user.role } });
    } catch (err) {
      console.error("register error", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =========================
   LOGIN  (intern OR admin)
========================= */
router.post(
  "/login",
  [body("email").isEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ message: "Invalid credentials" });

      const token = signToken(user);
      res.json({
        token,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
    } catch (err) {
      console.error("login error", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
