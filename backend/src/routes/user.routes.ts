import express from "express";
import userController from "../controllers/user.controller";
import { authMiddleware } from "../controllers/auth.controller";
import asyncHandler from "../middleware/asyncHandler";
import upload from "../middleware/multerConfig";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: User
 *  description: The User API
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current logged in user's profile
 *     tags: [User]
 *     responses:
 *       200:
 *         description: The user profile information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, asyncHandler(userController.getCurrentUser));

/**
 * @swagger
 * /users/{id}/hobbies:
 *   get:
 *     summary: Get hobbies of a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     responses:
 *       200:
 *         description: List of hobbies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/:id/hobbies", authMiddleware, asyncHandler(userController.getUserHobbies));

/**
 * @swagger
 * /users/likes:
 *   get:
 *     summary: Get the list of likes for the current logged in user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: List of likes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/likes", authMiddleware, asyncHandler(userController.getUserLikes));

/**
 * User Profile Routes
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user's profile by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     responses:
 *       200:
 *         description: User profile information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", authMiddleware, asyncHandler(userController.getUser));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User profile updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 email:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", authMiddleware, upload.single('profilePicture'), asyncHandler(userController.updateProfile));

/**
 * @swagger
 * /users/{id}/profile-picture:
 *   put:
 *     summary: Update user's profile picture
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user id
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile picture updated
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/profile-picture", authMiddleware, upload.single("profilePicture"), asyncHandler(userController.uploadProfilePicture));

/**
 * Event Management Routes
 */

/**
 * @swagger
 * /users/events:
 *   post:
 *     summary: Create a new event
 *     tags: [User]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.post('/events', authMiddleware, asyncHandler(userController.createEvent));

/**
 * @swagger
 * /users/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 */
router.put('/events/:id', authMiddleware, asyncHandler(userController.updateEvent));

/**
 * @swagger
 * /users/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event id
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/events/:id', authMiddleware, asyncHandler(userController.deleteUserEvent));

/**
 * @swagger
 * /users/comments/{id}:
 *   post:
 *     summary: Add a comment to an event
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/comments/:id', authMiddleware, asyncHandler(userController.addCommentToEvent));

export default router;
 
