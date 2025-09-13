import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  approved: { type: Boolean, default: true }, // for moderation
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
