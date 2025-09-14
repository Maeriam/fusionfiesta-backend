import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  registerUser,
  loginUser,
  getUsers,
  upgradeToParticipant,
  approveStaff,
  getDashboard,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Users
router.get("/users", getUsers);

// Upgrade & approval
router.post("/upgrade", protect, upgradeToParticipant);
router.post("/approve-staff/:id", approveStaff);

// Dashboard
router.get("/dashboard", getDashboard);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;  // ✅ default export
