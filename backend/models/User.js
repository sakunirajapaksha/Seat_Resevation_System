import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  address:   { type: String, default: "" },
  dob:       { type: Date },
  nic:       { type: String },
  email:     { type: String, required: true, unique: true, lowercase: true },
  phone:     { type: String },
  techStack: { type: String, default: "" },       // ✅ optional for admin
  university:{ type: String },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["intern", "admin"], default: "intern" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || mongoose.model("User", userSchema);
