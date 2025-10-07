import express from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";
import User from "../models/User.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js"; // ✅ make sure this file exports BOTH

const router = express.Router();

/**
 * GET /api/reservations/available?date=YYYY-MM-DD
 * → Seats NOT booked for the given date
 */
router.get("/available", authMiddleware, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const reservedSeatIds = await Reservation.find({
      date: new Date(date),
      status: "active",
    }).distinct("seat");

    const seats = await Seat.find({ _id: { $nin: reservedSeatIds } });
    res.json(seats);
  } catch (err) {
    console.error("Available seats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/reservations/all-seats?date=YYYY-MM-DD
 * → Return ALL 50 seats with booked/available info for the selected date
 */
router.get("/all-seats", authMiddleware, async (req, res) => {
  const { date } = req.query;
  const dayStart = new Date(date);
  const dayEnd = new Date(date);
  dayEnd.setHours(23,59,59,999);

  const reservations = await Reservation.find({
    date: { $gte: dayStart, $lte: dayEnd },
    status: "active",
  }).populate("intern", "firstName lastName email");

  const reservedMap = {};
  reservations.forEach(r => reservedMap[r.seat] = r);

  const seats = await Seat.find().sort("seatNumber");
  const result = seats.map(seat => ({
    ...seat.toObject(),
    booked: !!reservedMap[seat._id],
    reservedBy: reservedMap[seat._id]
      ? {
          name: reservedMap[seat._id].intern.firstName,
          email: reservedMap[seat._id].intern.email,
        }
      : null
  }));

  res.json(result);
});


/**
 * POST /api/reservations/book
 * → Intern books a seat
 */
router.post("/book", authMiddleware, async (req, res) => {
  try {
    const { seatId, date } = req.body;
    if (!seatId || !date)
      return res.status(400).json({ message: "Seat and date are required" });

    const selectedDate = new Date(date);
    const now = new Date();

    // Must book at least 1 hour in advance
    if (selectedDate - now < 60 * 60 * 1000) {
      return res.status(400).json({ message: "Must book at least 1 hour in advance" });
    }

    // Only one active reservation per intern per day
    const already = await Reservation.findOne({
      intern: req.user.id,
      date: selectedDate,
      status: "active",
    });
    if (already)
      return res.status(400).json({ message: "You already booked a seat for this day" });

    // Seat must be free
    const taken = await Reservation.findOne({
      seat: seatId,
      date: selectedDate,
      status: "active",
    });
    if (taken)
      return res.status(400).json({ message: "Seat already taken" });

    const newReservation = await Reservation.create({
      intern: req.user.id,
      seat: seatId,
      date: selectedDate,
      status: "active",
    });

    res.status(201).json({
      message: "Seat booked successfully",
      reservation: newReservation,
    });
  } catch (err) {
    console.error("Book seat error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/reservations/mine
 * → Intern’s own reservations (past & future)
 */
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const list = await Reservation.find({ intern: req.user.id })
      .populate("seat")
      .sort({ date: -1 });
    res.json(list);
  } catch (err) {
    console.error("Fetch my reservations error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/reservations/cancel/:id
 * → Cancel own reservation
 */
router.post("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      intern: req.user.id,
    });
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    reservation.status = "cancelled";
    await reservation.save();
    res.json({ message: "Reservation cancelled" });
  } catch (err) {
    console.error("Cancel reservation error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/reservations/by-date?date=YYYY-MM-DD
 * → Admin: view all reservations for a specific date
 */
router.get("/by-date", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const dayStart = new Date(date);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const reservations = await Reservation.find({
      date: { $gte: dayStart, $lte: dayEnd },
    })
      .populate("seat")
      .populate("intern", "firstName lastName email")
      .sort({ date: 1 });

    res.json(reservations);
  } catch (err) {
    console.error("Reservations by date error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /api/reservations/by-intern?internId=... or ?email=...
 * → Admin: all reservations by a specific intern
 */
router.get("/by-intern", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { internId, email } = req.query;
    if (!internId && !email)
      return res.status(400).json({ message: "Provide internId or email to search" });

    const intern = internId
      ? await User.findById(internId)
      : await User.findOne({ email });

    if (!intern) return res.status(404).json({ message: "Intern not found" });

    const reservations = await Reservation.find({ intern: intern._id })
      .populate("seat")
      .populate("intern", "firstName lastName email")
      .sort({ date: -1 });

    res.json({ intern, reservations });
  } catch (err) {
    console.error("Reservations by intern error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/reservations/manual-assign
 * → Admin manually assigns a seat to an intern
 */
router.post("/manual-assign", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { internId, seatId, date } = req.body;
    if (!internId || !seatId || !date)
      return res.status(400).json({ message: "internId, seatId and date required" });

    const intern = await User.findById(internId);
    if (!intern) return res.status(404).json({ message: "Intern not found" });

    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: "Seat not found" });

    const selectedDate = new Date(date);

    const seatTaken = await Reservation.findOne({
      seat: seatId,
      date: selectedDate,
      status: "active",
    });
    if (seatTaken)
      return res.status(400).json({ message: "Seat already taken on that date" });

    const internBooked = await Reservation.findOne({
      intern: internId,
      date: selectedDate,
      status: "active",
    });
    if (internBooked)
      return res.status(400).json({ message: "Intern already has a seat for that date" });

    const reservation = await Reservation.create({
      intern: internId,
      seat: seatId,
      date: selectedDate,
      status: "active",
    });

    res.status(201).json({ message: "Seat assigned successfully", reservation });
  } catch (err) {
    console.error("Manual assign error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
