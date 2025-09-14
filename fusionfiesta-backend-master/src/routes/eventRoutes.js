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
router.get("/", getEvents);
router.get("/certificates", getCertificates);
router.get("/my-events", getMyEvents);
router.get("/dashboard", getDashboardData); // 👈 new route

// Generic routes with dynamic :id last
router.get("/:id", getEventById);
router.put("/:id", editEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/participants", getParticipants);
router.post("/:id/co-organizers", addCoOrganizer);
router.delete("/:id/co-organizers/:userId", removeCoOrganizer);
router.get("/:id/stats", getEventStats);
router.post("/:id/register", registerForEvent);
router.post("/:id/approve", approveEvent);
router.patch("/:id/status", updateEventStatus);
router.delete("/:id/cancel", cancelRegistration);

// Other non-ID routes
router.post("/", createEvent);
router.post("/certificate", uploadCertificate);
router.post("/feedback", submitFeedback);



export default router;  // ✅ default export
