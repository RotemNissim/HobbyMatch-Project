import express from 'express';
import userController from '../controllers/user.controller';
import { authMiddleware } from '../controllers/auth.controller';
import  asyncHandler  from '../middleware/asyncHandler';

const router = express.Router();

router.get('/me', authMiddleware, asyncHandler(userController.getCurrentUser));
router.get('/hobbies', authMiddleware, asyncHandler(userController.getUserHobbies));
router.get('/likes', authMiddleware, asyncHandler(userController.getUserLikes));

/**
 * User Profile Routes
 */
router.get('/:id', authMiddleware, asyncHandler(userController.getUser));   // This expects AuthRequest
router.put('/:id', authMiddleware, asyncHandler(userController.updateProfile));

/**
 * Event Management Routes
 */
router.post('/events', authMiddleware, asyncHandler(userController.createEvent));
router.put('/events/:id', authMiddleware, asyncHandler(userController.updateEvent));

router.post('/comments/:id', authMiddleware, asyncHandler(userController.addCommentToEvent));

export default router;