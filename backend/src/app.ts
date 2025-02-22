import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import eventRoutes from './routes/event.routes';
import hobbyRoutes from './routes/hobby.routes';
import likeRoutes from './routes/like.routes';
import messageRoutes from './routes/message.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/hobbies', hobbyRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

// Global Error Handler
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
});

export default app;
