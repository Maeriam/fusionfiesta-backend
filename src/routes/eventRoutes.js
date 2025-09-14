import express from "express";
import { protect } from "../middleware/authMiddleware.js";
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
  cancelRegistration,
  editEvent,
  deleteEvent,
  getParticipants,
  addCoOrganizer,
  removeCoOrganizer,
  getEventStats,
  getMyEvents,
  getDashboardData,
} from "../controllers/eventController.js";


const router = express.Router();

// Event routes
// Specific routes first
router.get("/certificates", protect, getCertificates);
router.get("/my-events", protect, getMyEvents);
router.get("/dashboard", protect, getDashboardData); // 👈 new route

// Generic routes with dynamic :id last
router.get("/:id", getEventById);
router.patch("/:id", protect, editEvent);
router.delete("/:id", protect, deleteEvent);
router.get("/:id/participants", protect, getParticipants);
router.post("/:id/co-organizers", protect, addCoOrganizer);
router.delete("/:id/co-organizers/:userId", protect, removeCoOrganizer);
router.get("/:id/stats", protect, getEventStats);
router.post("/:id/register", protect, registerForEvent);
router.post("/:id/approve", protect, approveEvent);
router.patch("/:id/status", protect, updateEventStatus);
router.delete("/:id/cancel", protect, cancelRegistration);

// Other non-ID routes
router.post("/", protect, createEvent);    
router.post("/certificate", protect, uploadCertificate);
router.post("/feedback", protect, submitFeedback);



export default router;  // ✅ default export
