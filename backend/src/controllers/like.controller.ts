import { Request, Response } from 'express';
import likeService from '../services/like.service';

class LikeController {
  /**
   * Like an event
   */
  async likeEvent(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { eventId } = req.body;
      const updatedEvent = await likeService.likeEvent(userId, eventId);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to like event';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Dislike an event
   */
  async dislikeEvent(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { eventId } = req.body;
      const updatedEvent = await likeService.dislikeEvent(userId, eventId);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to dislike event';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Like a user
   */
  async likeUser(req: Request, res: Response) {
    try {
      const currentUserId = req.params.userId;
      const { targetUserId } = req.body;
      const updatedUser = await likeService.likeUser(currentUserId, targetUserId);
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to like user';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Dislike a user
   */
  async dislikeUser(req: Request, res: Response) {
    try {
      const currentUserId = req.params.userId;
      const { targetUserId } = req.body;
      const updatedUser = await likeService.dislikeUser(currentUserId, targetUserId);
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to dislike user';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new LikeController();