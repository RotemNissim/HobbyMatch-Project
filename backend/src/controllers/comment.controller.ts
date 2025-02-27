import { Request, Response } from 'express';
import commentService from '../services/comment.service';

class MessageController {
  /**
   * Send a comment from one user to another
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.params.senderId;
      const { receiverId, content } = req.body;
      const newMessage = await commentService.sendMessage(senderId, receiverId, content);
      res.status(201).json(newMessage);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to send comment';
      res.status(400).json({ comment: errMsg });
    }
  }

  /**
   * Get messages between two users
   */
  async getMessages(req: Request, res: Response) {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await commentService.getMessages(userId1, userId2);
      res.status(200).json(messages);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch messages';
      res.status(400).json({ comment: errMsg });
    }
  }
}

export default new MessageController();