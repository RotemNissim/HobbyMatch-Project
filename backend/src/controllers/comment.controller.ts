import { Request, Response } from "express";
import commentService from "../services/comment.service";

class CommentController {
  /**
   * Send a comment from one user to another
   */
  async sendComment(req: Request, res: Response) {
    try {
      const senderId = req.params.senderId;
      const { receiverId, content } = req.body;
      const newComment = await commentService.sendComment(
        senderId,
        receiverId,
        content
      );
      res.status(201).json(newComment);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to send comment";
      res.status(400).json({ comment: errMsg });
    }
  }

  /**
   * Get comments between two users
   */
  async getComments(req: Request, res: Response) {
    try {
      const { userId1, userId2 } = req.params;
      const comments = await commentService.getComments(userId1, userId2);
      res.status(200).json(comments);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to fetch messages";
      res.status(400).json({ comment: errMsg });
    }
  }
}

export default new CommentController();
