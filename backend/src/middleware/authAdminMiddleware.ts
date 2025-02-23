// src/middleware/authorizeAdmin.ts

import { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.models';
import { AuthRequest } from './authMiddleware';

export const authorizeAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = (req.user as { id: string })?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: No user ID in token' });
    }

    // Check if user exists in Admin collection
    const admin = await Admin.findById(userId);

    if (!admin) {
      return res.status(403).json({ message: 'Access denied. Not an admin.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin validation.' });
  }
};
