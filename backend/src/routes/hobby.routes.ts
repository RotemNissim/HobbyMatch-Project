import express, { Request, Response, NextFunction } from 'express';
import Hobby from '../models/Hobby.models';
import { authenticateToken, AuthRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Get all hobbies
router.get('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hobbies = await Hobby.find();
    res.json(hobbies);
  } catch (err) {
    next(err);
  }
});

// Add a new hobby (admin only, if needed)
router.post('/', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, category } = req.body;

    const existingHobby = await Hobby.findOne({ name });
    if (existingHobby) {
      res.status(400).json({ message: 'Hobby already exists' });
      return;
    }

    const newHobby = new Hobby({ name, category });
    await newHobby.save();

    res.status(201).json(newHobby);
  } catch (err) {
    next(err);
  }
});

// Delete a hobby (optional, if allowed)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const hobby = await Hobby.findByIdAndDelete(req.params.id);

    if (!hobby) {
      res.status(404).json({ message: 'Hobby not found' });
      return;
    }

    res.json({ message: 'Hobby deleted' });
  } catch (err) {
    next(err);
  }
});

/**
 * Error handling middleware for hobby routes
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
