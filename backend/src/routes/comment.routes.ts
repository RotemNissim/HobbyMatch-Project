import express from "express";
import commentController from "../controllers/comment.controller";
import { authMiddleware } from "../controllers/auth.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: The comment API
 */
// Send a comment from one user to another (Direct User-to-User Comment)
router.post("/:senderId/send", authMiddleware, commentController.sendComment);

export default router;
