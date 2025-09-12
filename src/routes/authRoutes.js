import express from "express";
import { registerUser, loginUser,getUsers } from "../controllers/authController.js";
import { protect,adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", protect, adminOnly, getUsers);

export default router;
