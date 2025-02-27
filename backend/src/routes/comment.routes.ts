import express, { Request, Response, NextFunction } from "express";
import Comment from "../models/Comment.models";
import { authenticateToken, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// Post a comment
router.post(
  "/",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { eventId, content } = req.body;

      if (!req.user) {
        res.status(403).json({ comment: "Unauthorized" });
        return;
      }

      const newComment = new Comment({
        sender: (req.user as any).id,
        event: eventId,
        content,
      });

      await newComment.save();
      res.status(201).json(newComment);
    } catch (err) {
      next(err);
    }
  }
);

// Get comments for an event
router.get(
  "/:eventId",
  authenticateToken,
  async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const comments = await Comment.find({
        event: req.params.eventId,
      }).populate("sender", "username");
      res.json(comments);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * Error handling middleware for comment routes
 */
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: "An unknown error occurred" });
  }
});

export default router;
