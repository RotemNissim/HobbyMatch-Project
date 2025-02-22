// src/services/notification.service.ts

import Notification from '../models/Notification.models';
import mongoose from 'mongoose';

class NotificationService {
  /**
   * Send a notification to a user
   */
  async sendNotification(userId: string, message: string, type: string) {
    const newNotification = new Notification({
      user: new mongoose.Types.ObjectId(userId),
      message,
      type,
      read: false,
      timestamp: new Date(),
    });

    await newNotification.save();
    return newNotification;
  }

  /**
   * Get all notifications for a user
   */
  async getUserNotifications(userId: string) {
    const notifications = await Notification.find({ user: userId }).sort({ timestamp: -1 });
    return notifications;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId: string) {
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!updatedNotification) {
      throw new Error('Notification not found');
    }

    return updatedNotification;
  }
}

export default new NotificationService();
