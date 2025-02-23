import express, { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.models';
import { authenticateToken } from '../middleware/authMiddleware';
import { authorizeAdmin } from '../middleware/authAdminMiddleware';
import AdminController from '../controllers/admin.controller';

const router = express.Router();

router.use([authenticateToken,authorizeAdmin]);

router.post('/users', (req, res) => AdminController.createUser(req: Request, res:Response));
router.put('/users/:id', (req, res) => AdminController.updateUser(req, res));
router.delete('/users/:id', (req, res) => AdminController.deleteUser(req, res));
router.get('/users', (req, res) => AdminController.listUsers(req, res));


router.post('/events', (req, res) => AdminController.createEvent(req, res));
router.put('/events/:id', (req, res) => AdminController.updateEvent(req, res));
router.delete('/events/:id', (req, res) => AdminController.deleteEvent(req, res));
router.get('/events', (req, res) => AdminController.listEvents(req, res));

export default router;

