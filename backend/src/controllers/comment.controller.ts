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

}

export default new CommentController();
