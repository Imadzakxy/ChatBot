import { Router } from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";
import { userLoggedInController } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes with rate limiting
router.post("/register", registerController);
router.post("/login", loginController);

// Protected routes
router.post("/logout", userLoggedInController, logoutController);

export default router;
