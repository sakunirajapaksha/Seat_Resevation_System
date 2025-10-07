// backend/routes/seat.js
import express from "express";
import Seat from "../models/Seat.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";

const router = express.Router();

/**
 * POST /api/seats
 * Admin adds seats for a specific date
 */
router.post("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { seatNumber, date, location, amenities } = req.body;

    if (!seatNumber || !date) {
      return res.status(400).json({ message: "Seat number and date are required" });
    }

    const exists = await Seat.findOne({ seatNumber, date });
    if (exists) {
      return res.status(400).json({ message: `Seat ${seatNumber} already exists for ${date}` });
    }

    const seat = await Seat.create({
      seatNumber,
      date,
      location,
      amenities: amenities || [],
    });

    res.status(201).json({ message: "Seat added successfully", seat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/seats
 * View seats, optionally filtered by date
 * Example: /api/seats?date=2025-09-20
 */
router.get("/", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { date } = req.query;
    const filter = date ? { date } : {};
    const seats = await Seat.find(filter).sort({ date: 1, seatNumber: 1 });
    res.json(seats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { seatNumber, date, location, amenities } = req.body;

    const updated = await Seat.findByIdAndUpdate(
      req.params.id,
      {
        ...(seatNumber && { seatNumber }),
        ...(date && { date }),
        ...(location && { location }),
        amenities: amenities || [],
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Seat not found" });
    res.json({ message: "Seat updated successfully", seat: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  try {
    const seat = await Seat.findByIdAndDelete(req.params.id);
    if (!seat) return res.status(404).json({ message: "Seat not found" });
    res.json({ message: `Seat ${seat.seatNumber} on ${seat.date} deleted successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
