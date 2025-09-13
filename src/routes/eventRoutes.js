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
  cancelRegistration,
} from "../controllers/eventController.js";

const router = express.Router();

// Event routes
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.post("/:id/register", registerForEvent);
router.post("/:id/approve", approveEvent);
router.post("/certificate", uploadCertificate);
router.get("/certificates", getCertificates);
router.post("/feedback", submitFeedback);
router.patch("/:id/status", updateEventStatus);
router.delete("/:id/cancel", cancelRegistration);

export default router;  // ✅ default export
