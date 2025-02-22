import { Request, Response } from 'express';
import notificationService from '../services/notification.service';

class NotificationController {
  /**
   * Send a notification to a user
   */
  async sendNotification(req: Request, res: Response) {
    try {
      const { userId, message, type } = req.body;
      const notification = await notificationService.sendNotification(userId, message, type);
      res.status(201).json(notification);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to send notification';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Get notifications for a user
   */
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const notifications = await notificationService.getUserNotifications(userId);
      res.status(200).json(notifications);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch notifications';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(req: Request, res: Response) {
    try {
      const notificationId = req.params.notificationId;
      const updatedNotification = await notificationService.markAsRead(notificationId);
      res.status(200).json(updatedNotification);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to mark notification as read';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new NotificationController();