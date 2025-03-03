import express from 'express';
import commentController from '../controllers/comment.controller';
import { authMiddleware } from '../controllers/auth.controller';

const router = express.Router();

// Send a comment from one user to another (Direct User-to-User Comment)
router.post('/:senderId/send', authMiddleware, commentController.sendComment);

// Get comments between two users (Direct User-to-User Chat)
router.get('/:userId1/:userId2', authMiddleware, commentController.getComments);

export default router;
