import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();

// ✅ Middlewares first
app.use(cors());
app.use(express.json());  // <--- this must come before routes

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("FusionFiesta API is running 🚀");
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
