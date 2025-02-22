import express, { Request, Response, NextFunction } from 'express';
import Like from '../models/Like.models';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Like an event
router.post('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId } = req.body;

    if (!req.user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const existingLike = await Like.findOne({ user: (req.user as any).id, event: eventId });

    if (existingLike) {
      res.status(400).json({ message: 'Already liked' });
      return;
    }

    const newLike = new Like({ user: (req.user as any).id, event: eventId });
    await newLike.save();

    res.status(201).json(newLike);
  } catch (err) {
    next(err);
  }
});

// Unlike an event
router.delete('/:eventId', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!req.user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const deletedLike = await Like.findOneAndDelete({ user: (req.user as any).id, event: eventId });

    if (!deletedLike) {
      res.status(404).json({ message: 'Like not found' });
      return;
    }

    res.json({ message: 'Unliked successfully' });
  } catch (err) {
    next(err);
  }
});

// Get likes for an event
router.get('/:eventId', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const likes = await Like.find({ event: req.params.eventId });
    res.json({ count: likes.length });
  } catch (err) {
    next(err);
  }
});

/**
 * Error handling middleware for like routes
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
