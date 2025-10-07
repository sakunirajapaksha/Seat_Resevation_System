import express from "express";
import Reservation from "../models/Reservation.js";
import Seat from "../models/Seat.js";
import { authMiddleware, adminOnly } from "../middlewares/auth.js";
import { Parser } from "json2csv"; // for CSV export

const router = express.Router();

/**
 * GET /api/reports/seat-usage
 * Query: startDate, endDate, location(optional), format(optional csv)
 * Description: Generate seat usage report
 */
router.get("/seat-usage", authMiddleware, adminOnly, async (req, res) => {
  try {
    const { startDate, endDate, location, format } = req.query;

    if (!startDate || !endDate)
      return res.status(400).json({ message: "startDate and endDate required" });

    const filter = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
      status: "active"
    };

    // Filter by location if provided
    if (location && location !== "all") {
      const seatIds = await Seat.find({ location }).distinct("_id");
      filter.seat = { $in: seatIds };
    }

    // Aggregate seat usage
    const usage = await Reservation.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$seat",
          totalReservations: { $sum: 1 },
          uniqueUsers: { $addToSet: "$intern" }
        }
      },
      {
        $project: {
          seat: "$_id",
          totalReservations: 1,
          uniqueUsersCount: { $size: "$uniqueUsers" },
          _id: 0
        }
      }
    ]);

    // Populate seat details
    const seatIds = usage.map((u) => u.seat);
    const seats = await Seat.find({ _id: { $in: seatIds } });

    const report = usage.map((u) => {
      const seat = seats.find((s) => s._id.toString() === u.seat.toString());
      return {
        seatNumber: seat?.seatNumber || "Unknown",
        location: seat?.location || "N/A",
        totalReservations: u.totalReservations,
        uniqueUsers: u.uniqueUsersCount
      };
    });

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(report);
      res.header("Content-Type", "text/csv");
      res.attachment(`seat_usage_${startDate}_${endDate}.csv`);
      return res.send(csv);
    }

    res.json(report);
  } catch (err) {
    console.error("Seat usage report error", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
