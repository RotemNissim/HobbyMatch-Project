import express from "express";
import EventController from "../controllers/event.controller";
import { authMiddleware } from "../controllers/auth.controller";
import asyncHandler from "../middleware/asyncHandler";
import CommentController from "../controllers/comment.controller";
import { AuthRequest } from "../middleware/AuthRequest";

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

router.post('/',authMiddleware,async (req, res) => await EventController.createEvent(req, res));

router.put('/:id',authMiddleware,async (req, res) => await EventController.updateEvent(req, res));

router.delete('/:id',authMiddleware,async (req, res) => await EventController.deleteEvent(req, res));

router.get('/', async (req, res) => await EventController.listEvents(req, res));

router.post('/:id/join',authMiddleware,async (req, res) => await EventController.joinEvent(req, res));

router.post('/:id/leave',authMiddleware,async (req, res) => await EventController.leaveEvent(req, res));

router.get('/:id', authMiddleware, asyncHandler(EventController.getEvent));

router.get('/:id/comments',authMiddleware,asyncHandler(EventController.getCommentsToEvent));
router.post('/:id/comments',authMiddleware,asyncHandler(CommentController.addCommentToEvent));

router.post('/recommend',authMiddleware,async (req, res) => await EventController.recommendEvents(req as AuthRequest, res));

export default router;
