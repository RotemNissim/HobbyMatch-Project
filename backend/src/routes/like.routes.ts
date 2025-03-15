import express from "express";
import likeController from "../controllers/like.controller";
import { authMiddleware } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Like
 *  description: The Like API
 */
// Authenticated - Like an event
router.post("/:userId/event/like", authMiddleware, likeController.likeEvent);

// Authenticated - Dislike an event
router.post(
  "/:userId/event/dislike",
  authMiddleware,
  likeController.dislikeEvent
);

// Authenticated - Like a user
router.post("/:userId/user/like", authMiddleware, likeController.likeUser);

// Authenticated - Dislike a user
router.post(
  "/:userId/user/dislike",
  authMiddleware,
  likeController.dislikeUser
);

export default router;
