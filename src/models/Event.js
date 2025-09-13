import mongoose from "mongoose";

<<<<<<< HEAD
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String },
  category: { type: String, enum: ["technical", "cultural", "sports"], required: true },
  registrationLimit: { type: Number, default: 0 },
  bannerImage: { type: String },
  guidelinesDocument: { type: String },
  coOrganizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status: { type: String, enum: ["Pending", "Live", "Completed"], default: "Pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approved: { type: Boolean, default: false },
  registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });
=======
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    bannerUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf

export default mongoose.model("Event", eventSchema);
