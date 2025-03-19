import express from "express";
import likeController from "../controllers/like.controller";
import { authMiddleware } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Like
 *  description: The Like API
 */
// Authenticated - Like an event

/**
 * @swagger
 * /likes/{userId}/event/like:
 *   post:
 *     summary: Like an event for a user
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: The ID of the user liking the event
 *     responses:
 *       200:
 *         description: Event liked successfully
 *       400:
 *         description: Failed to like event
 *       500:
 *         description: Internal server error
 */

router.post("/:userId/event/like", authMiddleware, likeController.likeEvent);

// Authenticated - Dislike an event


/**
 * @swagger
 * /likes/{userId}/event/dislike:
 *   post:
 *     summary: Dislike an event for a user
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: The ID of the user disliking the event
 *     responses:
 *       200:
 *         description: Event disliked successfully
 *       400:
 *         description: Failed to dislike event
 *       500:
 *         description: Internal server error
 */

router.post("/:userId/event/dislike",authMiddleware,likeController.dislikeEvent);

// Authenticated - Like a user

/**
 * @swagger
 * /likes/{userId}/user/like:
 *   post:
 *     summary: Like a user
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: The ID of the user liking another user
 *     responses:
 *       200:
 *         description: User liked successfully
 *       400:
 *         description: Failed to like user
 *       500:
 *         description: Internal server error
 */

router.post("/:userId/user/like", authMiddleware, likeController.likeUser);

// Authenticated - Dislike a user

/**
 * @swagger
 * /likes/{userId}/user/dislike:
 *   post:
 *     summary: Dislike a user
 *     tags: [Like]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         type: string
 *         description: The ID of the user disliking another user
 *     responses:
 *       200:
 *         description: User disliked successfully
 *       400:
 *         description: Failed to dislike user
 *       500:
 *         description: Internal server error
 */

router.post("/:userId/user/dislike",authMiddleware,likeController.dislikeUser);

export default router;
