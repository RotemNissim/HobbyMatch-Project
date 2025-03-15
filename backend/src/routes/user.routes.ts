import express from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../controllers/auth.controller";
import asyncHandler from "../middleware/asyncHandler";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The User API
 */

router.get("/me", authMiddleware, asyncHandler(userController.getCurrentUser));
router.get(
  "/:id/hobbies",
  authMiddleware,
  asyncHandler(userController.getUserHobbies)
);
router.get("/likes", authMiddleware, asyncHandler(userController.getUserLikes));

/**
 * User Profile Routes
 */
router.get("/:id", authMiddleware, asyncHandler(userController.getUser)); // This expects AuthRequest
router.put("/:id", authMiddleware, asyncHandler(userController.updateProfile));

/**
 * Event Management Routes
 */
router.post('/events', authMiddleware, asyncHandler(userController.createEvent));
router.put('/events/:id', authMiddleware, asyncHandler(userController.updateEvent));
router.delete('/events/:id', authMiddleware, asyncHandler(userController.deleteUserEvent));
router.post('/comments/:id', authMiddleware, asyncHandler(userController.addCommentToEvent));

export default router;
