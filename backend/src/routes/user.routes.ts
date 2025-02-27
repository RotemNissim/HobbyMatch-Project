import express from 'express';
import UserController from '../controllers/user.controller';
import { authMiddleware } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = express.Router();

/**
 * User Profile Routes
 */
router.get('/:id', authMiddleware, (req, res) => UserController.getUser(req, res));
router.put('/:id', authMiddleware, (req, res) => UserController.updateProfile(req, res));

/**
 * Event Management Routes
 */
router.post('/events', authMiddleware, asyncHandler(UserController.createEvent));
router.put('/events/:id', authMiddleware, asyncHandler(UserController.updateEvent));

/**
 * Hobbies Management Routes
 */
router.get('/hobbies', authMiddleware,asyncHandler(UserController.getUserHobbies));

/**
 * Likes Management Routes
 */
router.get('/likes', authMiddleware, asyncHandler(UserController.getUserLikes));

/**
 * Comments Management Routes
 */
router.post('/comments/:id', authMiddleware, asyncHandler(UserController.addCommentToEvent));

export default router;
