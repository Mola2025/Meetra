import { Router } from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Protected — returns the logged-in user's profile
router.get("/me", requireAuth, getMe);

export default router;
