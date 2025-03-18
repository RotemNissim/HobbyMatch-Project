import express from 'express';
import hobbyController from '../controllers/hobby.controller';
import  {authMiddleware}  from '../controllers/auth.controller';
import asyncHandler from '../middleware/asyncHandler';

const router = express.Router();

/**
* @swagger
* tags:
*   name: Hobby
*   description: The Hobby API
*/
// Public - List all hobbies


/**
 * @swagger
 * /hobbies:
 *   get:
 *     summary: Get a list of hobbies
 *     tags: [Hobby]
 *     responses:
 *       200:
 *         description: A list of hobbies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Tennis"
 *                   category:
 *                     type: string
 *                     example: "Sports"
 *                   users:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["userId1", "userId2"]
 *                   _id:
 *                     type: string
 *                     example: "5f87f0e4c5e9b5d1b6a47b3e"
 */

router.get('/', hobbyController.listHobbies);

// Authenticated - Add a hobby to a user's profile

/**
 * @swagger
 * /hobbies/{userId}/add:
 *   post:
 *     summary: Add a hobby to a user's profile
 *     tags: [Hobby]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user
 *       - name: hobbyId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hobbyId:
 *               type: string
 *               example: "5f87f0e4c5e9b5d1b6a47b3e"
 *     responses:
 *       200:
 *         description: The updated user object with the new hobby
 */

router.post('/:userId/add', authMiddleware, hobbyController.addHobby);

/**
 * @swagger
 * /hobbies/{userId}/toggle:
 *   post:
 *     summary: Toggle a hobby for a user (add or remove)
 *     tags: [Hobby]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user
 *       - name: hobbyId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hobbyId:
 *               type: string
 *               example: "5f87f0e4c5e9b5d1b6a47b3e"
 *     responses:
 *       200:
 *         description: The updated user object with the toggled hobby
 *       400:
 *         description: Failed to toggle hobby
 *       500:
 *         description: Internal server error
 */

router.post('/:userId/toggle', authMiddleware, asyncHandler(hobbyController.toggleHobby));

/**
 * @swagger
 * /hobbies/{eventId}/toggle:
 *   post:
 *     summary: Toggle a hobby for an event (add or remove)
 *     tags: [Hobby]
 *     parameters:
 *       - name: eventId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the event
 *       - name: hobbyId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hobbyId:
 *               type: string
 *               example: "5f87f0e4c5e9b5d1b6a47b3e"
 *     responses:
 *       200:
 *         description: The updated event object with the toggled hobby
 *       400:
 *         description: Failed to toggle hobby for the event
 *       500:
 *         description: Internal server error
 */
router.post('/:eventId/toggle', authMiddleware, asyncHandler(hobbyController.toggleHobbyInEvent));

// Authenticated - Remove a hobby from a user's profile

/**
 * @swagger
 * /hobbies/{userId}/remove:
 *   post:
 *     summary: Remove a hobby from a user's profile
 *     tags: [Hobby]
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the user
 *       - name: hobbyId
 *         in: body
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             hobbyId:
 *               type: string
 *               example: "5f87f0e4c5e9b5d1b6a47b3e"
 *     responses:
 *       200:
 *         description: The updated user object without the removed hobby
 */

router.post('/:userId/remove', authMiddleware, hobbyController.removeHobby);

export default router;
