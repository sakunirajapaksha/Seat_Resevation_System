import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Hardcoded Admin Credentials
const ADMIN_EMAIL = "sakunirajapaksha007@gmail.com";
const ADMIN_PASSWORD = "snrj0126";

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  // Create JWT
  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: "admin", email });
});

export default router;
