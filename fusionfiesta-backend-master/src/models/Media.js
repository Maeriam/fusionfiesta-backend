import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["image", "video"], required: true },
  url: { type: String, required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Media", mediaSchema);
