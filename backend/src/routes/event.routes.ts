import express from 'express';
import EventController from '../controllers/event.controller';
import { authMiddleware } from '../controllers/auth.controller';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

/**
 * Event Management Routes
 */

router.post('/', authMiddleware, async (req, res) => await EventController.createEvent(req, res));

router.put('/:id', authMiddleware, async (req, res) => await EventController.updateEvent(req, res));

router.delete('/:id', authMiddleware, async (req, res) => await EventController.deleteEvent(req, res));

router.get('/', async (req, res) => await EventController.listEvents(req, res));

router.post('/:id/join', authMiddleware, async (req, res) => await EventController.joinEvent(req, res));

router.post('/:id/leave', authMiddleware, async (req, res) => await EventController.leaveEvent(req, res));

router.get('/:id', authMiddleware ,asyncHandler(EventController.getEvent));

router.get('/:id/comments', authMiddleware, asyncHandler(EventController.getCommentsToEvent));

export default router;