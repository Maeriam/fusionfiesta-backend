import express from "express";
import {
  createEvent,
  getApprovedEvents,
  getAllEvents,
  approveEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getApprovedEvents);
router.get("/:id", protect, getEventById);

// Organizer
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

// Admin
router.get("/admin/all", protect, adminOnly, getAllEvents);
router.put("/admin/approve/:id", protect, adminOnly, approveEvent);

export default router;
