import { Router } from "express";
import {
  getRoomsController,
  postRoomController,
  postMessageController,
  getRoomController,
} from "../controllers/room.controller.js";
import { userLoggedInController } from "../middleware/auth.middleware.js";

const router = Router();

// All routes in this file require authentication
router.use(userLoggedInController);

// Room management routes with rate limiting
router.get("/", getRoomsController);
router.post("/", postRoomController);

// Message routes with rate limiting
router.post("/:id", postMessageController);
router.get("/:id", getRoomController);

export default router;
