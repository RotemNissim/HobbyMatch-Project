import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.models';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeAdmin } from '../middleware/authAdminMiddleware';

const router = express.Router();

/**
 * Utility function to handle async route errors
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   POST /admin/register
 * @desc    Register a new admin (only accessible by logged-in admins)
 */
router.post(
  '/register',
  [authenticateToken, // Verify JWT
  authorizeAdmin],    // Ensure requester is an admin
  asyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  })
);

/**
 * @route   POST /admin/login
 * @desc    Authenticate admin & get token
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  res.json({
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      email: admin.email
    }
  });
}));

/**
 * @route   POST /admin/logout
 * @desc    Logout admin (client should delete token)
 */
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logout successful' });
});

/**
 * Error handling middleware for async routes
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
