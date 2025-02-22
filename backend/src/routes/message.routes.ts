import express, { Request, Response, NextFunction } from 'express';
import Message from '../models/Message.models';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Post a message
router.post('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId, content } = req.body;

    if (!req.user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const newMessage = new Message({
      sender: (req.user as any).id,
      event: eventId,
      content
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
});

// Get messages for an event
router.get('/:eventId', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Message.find({ event: req.params.eventId }).populate('sender', 'username');
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

/**
 * Error handling middleware for message routes
 */
router.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
});

export default router;
