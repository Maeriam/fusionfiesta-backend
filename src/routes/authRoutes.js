import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  upgradeToParticipant,
  approveStaff,
  getDashboard,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

const router = express.Router();

// ===== Auth routes =====
router.post("/register", registerUser);
router.post("/login", loginUser);

router.put("/upgrade", protect, upgradeToParticipant);
router.put("/approve/:id", protect, adminOnly, approveStaff);
router.get("/dashboard", protect, getDashboard);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Get all users (admin only)
router.get("/", protect, adminOnly, getUsers);

// ===== Bookmark routes =====
router.post("/bookmark/:eventId", protect, async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (!user.bookmarkedEvents.includes(eventId)) {
      user.bookmarkedEvents.push(eventId);
      await user.save();
    }

    res.json({ message: "Event bookmarked", bookmarks: user.bookmarkedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/bookmark/:eventId", protect, async (req, res) => {
  try {
    const user = req.user;
    const { eventId } = req.params;

    const originalLength = user.bookmarkedEvents.length;
    user.bookmarkedEvents = user.bookmarkedEvents.filter(
      (id) => id.toString() !== eventId
    );

    if (user.bookmarkedEvents.length === originalLength) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await user.save();
    res.json({ message: "Bookmark removed", bookmarks: user.bookmarkedEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===== User profile =====
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("bookmarkedEvents")
      .populate("registeredEvents");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      registeredEvents: user.registeredEvents,
      bookmarkedEvents: user.bookmarkedEvents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
