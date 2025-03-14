import express, { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.models';
import { authMiddleware } from '../controllers/auth.controller';
import  AsyncHandler from '../middleware/asyncHandler';
import AdminController from '../controllers/admin.controller';
import eventController from '../controllers/event.controller';

const router = express.Router();



//Users Management
router.post('/users',authMiddleware, AsyncHandler(AdminController.createUser));
router.put('/users/:id',authMiddleware,AsyncHandler(AdminController.updateUser));
router.delete('/users/:id',authMiddleware,AsyncHandler(AdminController.deleteUser));
router.get('/users',authMiddleware,AsyncHandler(AdminController.listUsers));

//Events Management
router.post('/events', authMiddleware,AsyncHandler(AdminController.createEvent));
router.put('/events/:id', authMiddleware,AsyncHandler(AdminController.updateEvent));
router.delete('/events/:id', authMiddleware,AsyncHandler(AdminController.deleteEvent));
router.get('/events', authMiddleware,AsyncHandler(eventController.listEvents));

//HOBBIES ROUTE MANAGEMENT - YET TO BE IMPLEMENTED
router.post('/hobbies', authMiddleware,AsyncHandler(AdminController.createHobby));
router.put('/hobbies/:id', authMiddleware,AsyncHandler(AdminController.updateHobby));
router.delete('/hobbies/:id', authMiddleware,AsyncHandler(AdminController.deleteHobby));
router.get('/hobbies/', authMiddleware,AsyncHandler(AdminController.listHobbies));


//ADMINS ROUTE MANAGEMENT - YET TO BE IMPLEMENTED
router.get('/me', authMiddleware,AsyncHandler(AdminController.getCurrentAdmin));
router.post('/admins', authMiddleware,AsyncHandler(AdminController.createAdmin));
router.put('/admins/:id', authMiddleware,AsyncHandler(AdminController.updateAdmin));
router.delete('/admins/:id',authMiddleware,AsyncHandler(AdminController.deleteAdmin));
router.get('/admins',authMiddleware,AsyncHandler(AdminController.listAdmins));

export default router;

