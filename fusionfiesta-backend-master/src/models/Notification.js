import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String }, // e.g., event, certificate
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);
