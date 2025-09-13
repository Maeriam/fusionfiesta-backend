import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "organizer", "admin"], default: "student" },
<<<<<<< HEAD
  approved: { type: Boolean, default: false }, // for staff members
  enrolmentNumber: { type: String },          // student participants only
  department: { type: String },
  collegeIdProof: { type: String },
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  bookmarkedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
=======
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf
}, { timestamps: true });

export default mongoose.model("User", userSchema);
