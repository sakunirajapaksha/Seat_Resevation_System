import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";      // ✅ Reusable DB connection
import authRoutes from "./routes/auth.js";
import reservationRoutes from "./routes/reservations.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import seatRoutes from "./routes/seat.js";

dotenv.config();

const app = express();

// ===== Middlewares =====
app.use(cors());                             // Allow frontend requests (set origin for production)
app.use(express.json());                      // Parse JSON bodies

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/seats", seatRoutes); 

// Root test route
app.get("/", (req, res) => {
  res.json({ ok: true, message: "Seat reservation backend" });
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB first, then start server
const startServer = async () => {
  await connectDB();                          // <-- Uses config/db.js
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});
