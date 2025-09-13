import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  approveEvent,
  uploadCertificate,
  getCertificates,
  submitFeedback,
  updateEventStatus,
  cancelRegistration,   // ✅ add this
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/certificate", protect, uploadCertificate);
router.get("/certificates", protect, getCertificates);

// Public routes
router.get("/", getEvents);
router.get("/:id", getEventById);

// Protected routes
router.post("/", protect, createEvent);  // only organizers/admins can post events
router.post("/register/:id", protect, registerForEvent);

router.delete("/register/:id", protect, cancelRegistration);


// Admin route
router.put("/approve/:id", protect, adminOnly, approveEvent);

router.post("/certificate", protect, uploadCertificate);
router.get("/certificates", protect, getCertificates);

// Feedback
router.post("/feedback", protect, submitFeedback);

// Event status update
router.put("/status/:id", protect, updateEventStatus);

export default router;
