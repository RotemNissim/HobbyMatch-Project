import { Request, Response } from "express";
import commentService from "../services/comment.service";

class CommentController {
  async addCommentToEvent(req: Request, res: Response) {
    try {
      console.log("📩 Incoming Request Body:", req.body);
      console.log("🔍 Event ID Received:", req.params.eventId);

      const eventId = req.params.id;
      const userId = (req as any).user.id;
      const comment = req.body.content;
      if (!comment) {
        return res.status(400).send("comment is required");
      }
      const newComment = await commentService.addCommentToEvent(
         userId,
         eventId,
         comment
      );
      res.status(201).json(newComment);
    } catch (err) {
      console.error("🔥 Backend Error in addCommentToEvent:", err);
      return res.status(500).send(err);
    }
  }
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

}

export default new CommentController();
