import express, { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.models';
import { authMiddleware } from '../controllers/auth.controller';
import AdminController from '../controllers/admin.controller';

const router = express.Router();

router.use(authMiddleware);

router.post('/users', (req:Request, res:Response) => AdminController.createUser(req, res));
router.put('/users/:id', (req, res) => AdminController.updateUser(req, res));
router.delete('/users/:id', (req, res) => AdminController.deleteUser(req, res));
router.get('/users', (req, res) => AdminController.listUsers(req, res));


router.post('/events', (req:Request, res:Response) => AdminController.createEvent(req, res));
router.put('/events/:id', (req, res) => AdminController.updateEvent(req, res));
router.delete('/events/:id', (req, res) => AdminController.deleteEvent(req, res));
router.get('/events', (req, res) => AdminController.listEvents(req, res));

export default router;

