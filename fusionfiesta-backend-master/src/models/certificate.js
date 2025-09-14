import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  paid: { type: Boolean, default: false },
  qrCode: { type: String },
}, { timestamps: true });

export default mongoose.model("Certificate", certificateSchema);
