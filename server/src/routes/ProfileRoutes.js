import { Router } from "express";
import {
  getProfile,
  updateStatus,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// All hub routes require a valid JWT
router.use(requireAuth);

// GET  /hub/profile/:email  — read any profile
router.get("/profile/:email", getProfile);

// PATCH /hub/profile/status  — update own presence_status
router.patch("/profile/status", updateStatus);

// PATCH /hub/profile        — update name and/or email (logged-in user only)
router.patch("/profile", updateProfile);

// DELETE /hub/profile       — permanently delete account (logged-in user only)
router.delete("/profile", deleteAccount);

export default router;
