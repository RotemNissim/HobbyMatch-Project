import express from 'express';
import hobbyController from '../controllers/hobby.controller';
import  {authMiddleware}  from '../controllers/auth.controller';

const router = express.Router();

/**
* @swagger
* tags:
*   name: Hobby
*   description: The Hobby API
*/
// Public - List all hobbies
router.get('/', hobbyController.listHobbies);

// Authenticated - Add a hobby to a user's profile
router.post('/:userId/add', authMiddleware, hobbyController.addHobby);

// Authenticated - Remove a hobby from a user's profile
router.post('/:userId/remove', authMiddleware, hobbyController.removeHobby);

export default router;
