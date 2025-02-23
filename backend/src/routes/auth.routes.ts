import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.models';

const router = express.Router();

/**
 * Utility function to handle async route errors
 */
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * @route   POST /register
 * @desc    Register a new user
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already in use' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({ username, email, password: hashedPassword, firstName, lastName});
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
}));

/**
 * @route   POST /login
 * @desc    Authenticate user & get token
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Generate JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

  res.json({
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
}));

/**
 * @route   POST /logout
 * @desc    Logout user (client should delete token)
 */

router.post('/logout', (req: Request, res: Response) => {
  // Since JWT is stateless, the client simply deletes the token.
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
