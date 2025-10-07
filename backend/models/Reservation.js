import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat", required: true },
  intern: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
});

export default mongoose.model("Reservation", reservationSchema);
