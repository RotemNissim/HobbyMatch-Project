import express, { Response, NextFunction } from 'express';
import Event from '../models/Event.models';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create Event
router.post('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, date, location, hobby } = req.body;

    if (!req.user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const newEvent = new Event({
      title,
      description,
      date,
      location,
      hobby,
      createdBy: (req.user as any).id, // Ensure user has an id
      participants: [(req.user as any).id]
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
});

// Get all Events
router.get('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'username')
      .populate('participants', 'username');

    res.json(events);
  } catch (error) {
    next(error);
  }
});

// Join Event
router.post('/:id/join', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (!req.user) {
      res.status(403).json({ message: 'Unauthorized' });
      return;
    }

    const userId = (req.user as any).id;

    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
      await event.save();
    }

    res.json({ message: 'Joined event successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
