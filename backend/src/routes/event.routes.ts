import express from 'express';
import EventController from '../controllers/event.controller';
import { authMiddleware } from '../controllers/auth.controller';

const router = express.Router();

/**
 * Event Management Routes
 */
router.post('/', authMiddleware, async (req, res) => await EventController.createEvent(req, res));
router.put('/:id', authMiddleware, async (req, res) => await EventController.updateEvent(req, res));
router.delete('/:id', authMiddleware, async (req, res) => await EventController.deleteEvent(req, res));
router.get('/', async (req, res) => await EventController.listEvents(req, res));

export default router;