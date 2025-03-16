import express, { Request, Response, NextFunction } from 'express';
import Admin from '../models/Admin.models';
import { authMiddleware } from '../controllers/auth.controller';
import  AsyncHandler from '../middleware/asyncHandler';
import AdminController from '../controllers/admin.controller';
import eventController from '../controllers/event.controller';

const router = express.Router();



//Users Management

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *                   nullable: true
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Failed to create new user
 *       500:
 *         description: Internal server error
 */

router.post('/users',authMiddleware, AsyncHandler(AdminController.createUser));

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Failed to update user
 *       500:
 *         description: Internal server error
 */

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

