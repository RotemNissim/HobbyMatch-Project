import express from "express";
import EventController from "../controllers/event.controller";
import { authMiddleware } from "../controllers/auth.controller";
import asyncHandler from "../middleware/asyncHandler";
import CommentController from "../controllers/comment.controller";
import { AuthRequest } from "../middleware/AuthRequest";
import upload from "../middleware/multerConfig"

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: The Event API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - location
 *         - hobbies
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the event
 *         description:
 *           type: string
 *           description: A detailed description of the event
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the event
 *         location:
 *           type: string
 *           description: The location of the event
 *         hobbies:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of hobbies associated with the event
 *       example:
 *         title: "Mountain Hiking"
 *         description: "A challenging hike in the mountains."
 *         date: "2025-05-12"
 *         location: "Rocky Mountains"
 *         hobbies: ["hiking", "adventure", "outdoor"]
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date
 *                 location:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       500:
 *         description: Internal server error
 */

router.post('/',authMiddleware,async (req, res) => await EventController.createEvent(req as AuthRequest, res));

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update event"
 *       401:
 *         description: Unauthorized - Only the event creator can update
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Internal server error
 */
router.put('/:id',authMiddleware,async (req, res) => await EventController.updateEvent(req, res));

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event deleted successfully"
 *       401:
 *         description: Unauthorized - Only the event creator can delete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Event not found"
 *       500:
 *         description: Internal server error
 */

router.delete('/:id',authMiddleware,async (req, res) => await EventController.deleteEvent(req, res));

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get a list of events
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal server error
 */

router.get('/', async (req, res) => await EventController.listEvents(req, res));

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get details of a specific event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: Event details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.post('/:id/join',authMiddleware,async (req, res) => await EventController.joinEvent(req, res));

/**
 * @swagger
 * /events/{id}/comments:
 *   get:
 *     summary: Get all comments for a specific event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     responses:
 *       200:
 *         description: List of comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access Denied"
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.post('/:id/leave',authMiddleware,async (req, res) => await EventController.leaveEvent(req, res));

/**
 * @swagger
 * /events/{id}/comments:
 *   post:
 *     summary: Add a comment to a specific event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event to add a comment to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request (e.g., missing content)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.get('/:id', authMiddleware, asyncHandler(EventController.getEvent));

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the comment
 *         text:
 *           type: string
 *           description: The content of the comment
 *         createdBy:
 *           type: string
 *           description: The user who created the comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The time when the comment was created
 *       example:
 *         _id: "12345"
 *         text: "Great event, looking forward to it!"
 *         createdBy: "user123"
 *         createdAt: "2025-03-18T10:00:00Z"
 */


/**
 * @swagger
 * /events/{id}/comments:
 *   post:
 *     summary: Add a comment to a specific event
 *     tags: [Event]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Bad request, missing fields
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */


router.post('/recommend',authMiddleware,async (req, res) => await EventController.recommendEvents(req as AuthRequest, res));

router.post('/:id/comments', authMiddleware, asyncHandler(CommentController.addCommentToEvent));

router.get('/:id/comments',authMiddleware, asyncHandler(EventController.getCommentsToEvent)); 

router.put("/:id/upload-image", authMiddleware, upload.single("image"), asyncHandler(EventController.uploadEventImage));

export default router;
