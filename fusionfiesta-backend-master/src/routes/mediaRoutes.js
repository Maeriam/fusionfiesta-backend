import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadMedia, getMediaGallery, approveMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.post("/upload", protect, uploadMedia); // organizer/admin
router.get("/", getMediaGallery); // public for students/visitors
router.put("/approve/:id", protect, adminOnly, approveMedia);

export default router;
