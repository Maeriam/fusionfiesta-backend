import express from "express";
import {
<<<<<<< HEAD
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
=======
  createEvent,
  getApprovedEvents,
  getAllEvents,
  approveEvent,
  getEventById,
  updateEvent,
  deleteEvent,
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf
} from "../controllers/eventController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

<<<<<<< HEAD
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
=======
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
>>>>>>> 7779c856bd7116de54fee311847d516524e35faf

export default router;
