// src/routes/notification.routes.ts

import express from 'express';
import NotificationController from '../controllers/notification.controller';

const router = express.Router();

/**
 * @route   POST /api/notifications/send
 * @desc    Send a notification to a user
 */
router.post('/send', (req, res) => NotificationController.sendNotification(req, res));

/**
 * @route   GET /api/notifications/:userId
 * @desc    Get all notifications for a user
 */
router.get('/:userId', (req, res) => NotificationController.getUserNotifications(req, res));

/**
 * @route   PATCH /api/notifications/:notificationId/read
 * @desc    Mark a notification as read
 */
router.patch('/:notificationId/read', (req, res) => NotificationController.markAsRead(req, res));

export default router;
