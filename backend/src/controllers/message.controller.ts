import { Request, Response } from 'express';
import messageService from '../services/message.service';

class MessageController {
  /**
   * Send a message from one user to another
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.params.senderId;
      const { receiverId, content } = req.body;
      const newMessage = await messageService.sendMessage(senderId, receiverId, content);
      res.status(201).json(newMessage);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to send message';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Get messages between two users
   */
  async getMessages(req: Request, res: Response) {
    try {
      const { userId1, userId2 } = req.params;
      const messages = await messageService.getMessages(userId1, userId2);
      res.status(200).json(messages);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch messages';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new MessageController();