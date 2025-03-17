import express, { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin.models";
import { authMiddleware } from "../controllers/auth.controller";
import AsyncHandler from "../middleware/asyncHandler";
import AdminController from "../controllers/admin.controller";
import eventController from "../controllers/event.controller";

const router = express.Router();

//Users Management

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: The Admin API
 */

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Admin Create a new user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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

router.post("/users", authMiddleware, AsyncHandler(AdminController.createUser));

/**
 * @swagger
 * /admin/users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *         description: Failed to update user
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.put("/users/:id",authMiddleware,AsyncHandler(AdminController.updateUser));

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "User deleted successfully"
 *       400:
 *         description: Failed to delete user
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Failed to delete user"
 *       500:
 *         description: Internal server error
 */


router.delete("/users/:id",authMiddleware,AsyncHandler(AdminController.deleteUser));

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get a list of users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstName
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter users by first name
 *       - in: query
 *         name: lastName
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter users by last name
 *       - in: query
 *         name: email
 *         required: false
 *         schema:
 *           type: string
 *         description: Filter users by email
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   profilePicture:
 *                     type: string
 *                     nullable: true
 *                   accessToken:
 *                     type: string
 *                   refreshToken:
 *                     type: string
 *       400:
 *         description: Failed to list users
 *       500:
 *         description: Internal server error
 */

router.get("/users", authMiddleware, AsyncHandler(AdminController.listUsers));

//Events Management

/**
 * @swagger
 * /admin/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - createdBy
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *               description:
 *                 type: string
 *                 description: Event description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event date
 *               location:
 *                 type: string
 *                 description: Event location
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Related hobbies (optional)
 *               createdBy:
 *                 type: string
 *                 description: ID of the user who created the event
 *     responses:
 *       201:
 *         description: Event successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Event ID
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdBy:
 *                   type: string
 *       400:
 *         description: Failed to create new event
 *       500:
 *         description: Internal server error
 */

router.post("/events",authMiddleware,AsyncHandler(AdminController.createEvent));

/**
 * @swagger
 * /admin/events/{id}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - date
 *               - location
 *               - hobbies
 *             properties:
 *               title:
 *                 type: string
 *                 description: Event title
 *               description:
 *                 type: string
 *                 description: Event description
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Event date
 *               location:
 *                 type: string
 *                 description: Event location
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Related hobbies
 *     responses:
 *       200:
 *         description: Event successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Event ID
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 hobbies:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Failed to update event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.put("/events/:id",authMiddleware,AsyncHandler(AdminController.updateEvent));

/**
 * @swagger
 * /admin/events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID to delete
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       400:
 *         description: Failed to delete event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

router.delete("/events/:id",authMiddleware,AsyncHandler(AdminController.deleteEvent));

/**
 * @swagger
 * /admin/events:
 *   get:
 *     summary: Get a list of events
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter events by name
 *       - in: query
 *         name: hobbies
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter events by hobbies
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter events by location
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter events by date
 *       - in: query
 *         name: createdBy
 *         schema:
 *           type: string
 *         description: Filter events by creator ID
 *       - in: query
 *         name: participants
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Filter events by participants
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   hobbies:
 *                     type: array
 *                     items:
 *                       type: string
 *                   location:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: string
 *                   participants:
 *                     type: array
 *                     items:
 *                       type: string
 *       400:
 *         description: Failed to fetch events
 *       500:
 *         description: Internal server error
 */

router.get("/events", authMiddleware, AsyncHandler(eventController.listEvents));

//HOBBIES ROUTE MANAGEMENT - YET TO BE IMPLEMENTED

/**
 * @swagger
 * /admin/hobbies:
 *   post:
 *     summary: Create a new hobby
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Hobby name
 *               category:
 *                 type: string
 *                 description: Hobby category
 *     responses:
 *       201:
 *         description: Hobby successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Hobby ID
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs associated with the hobby (optional)
 *       400:
 *         description: Failed to create new hobby
 */

router.post("/hobbies",authMiddleware,AsyncHandler(AdminController.createHobby));

/**
 * @swagger
 * /admin/hobbies/{id}:
 *   put:
 *     summary: Update an existing hobby
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hobby ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *                 description: Hobby name
 *               category:
 *                 type: string
 *                 description: Hobby category
 *     responses:
 *       200:
 *         description: Hobby successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Hobby ID
 *                 name:
 *                   type: string
 *                 category:
 *                   type: string
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: List of user IDs associated with the hobby (optional)
 *       400:
 *         description: Failed to update hobby
 *       404:
 *         description: Hobby not found
 *       500:
 *         description: Internal server error
 */

router.put("/hobbies/:id",authMiddleware,AsyncHandler(AdminController.updateHobby));

/**
 * @swagger
 * /admin/hobbies/{id}:
 *   delete:
 *     summary: Delete a hobby
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hobby ID to delete
 *     responses:
 *       204:
 *         description: Hobby deleted successfully
 *       400:
 *         description: Failed to delete hobby
 *       404:
 *         description: Hobby not found
 *       500:
 *         description: Internal server error
 */

router.delete("/hobbies/:id",authMiddleware,AsyncHandler(AdminController.deleteHobby));

/**
 * @swagger
 * /admin/hobbies:
 *   get:
 *     summary: Get a list of hobbies
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter hobbies by name
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter hobbies by category
 *     responses:
 *       200:
 *         description: List of hobbies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Hobby ID
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   users:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: List of user IDs associated with the hobby (optional)
 *       400:
 *         description: Failed to list hobbies
 *       500:
 *         description: Internal server error
 */

router.get("/hobbies/",authMiddleware,AsyncHandler(AdminController.listHobbies));

//ADMINS ROUTE MANAGEMENT - YET TO BE IMPLEMENTED

/**
 * @swagger
 * /admin/me:
 *   get:
 *     summary: Get current admin details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Failed to get current admin
 *       403:
 *         description: Not an Authorized Admin
 */

router.get("/me",authMiddleware,AsyncHandler(AdminController.getCurrentAdmin));

/**
 * @swagger
 * /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
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
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin's password
 *               firstName:
 *                 type: string
 *                 description: Admin's first name
 *               lastName:
 *                 type: string
 *                 description: Admin's last name
 *               role:
 *                 type: string
 *                 enum: [admin]
 *                 description: Role of the user (must be 'admin')
 *     responses:
 *       201:
 *         description: Admin successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Failed to create new admin
 *       500:
 *         description: Internal server error
 */

router.post("/admins",authMiddleware,AsyncHandler(AdminController.createAdmin));

/**
 * @swagger
 * /admins/{id}:
 *   put:
 *     summary: Update an existing admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID to update
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
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Admin's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Admin's password
 *               firstName:
 *                 type: string
 *                 description: Admin's first name
 *               lastName:
 *                 type: string
 *                 description: Admin's last name
 *               role:
 *                 type: string
 *                 enum: [admin]
 *                 description: Role of the user (must be 'admin')
 *     responses:
 *       200:
 *         description: Admin successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Failed to update admin
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.put("/admins/:id",authMiddleware,AsyncHandler(AdminController.updateAdmin));

/**
 * @swagger
 * /admin/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID to delete
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       400:
 *         description: Failed to delete admin
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

router.delete("/admins/:id",authMiddleware,AsyncHandler(AdminController.deleteAdmin));

/**
 * @swagger
 * /admin/admins:
 *   get:
 *     summary: Get a list of admins
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Filter admins by first name
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Filter admins by last name
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filter admins by email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin]
 *         description: Filter admins by role (only 'admin' is allowed)
 *     responses:
 *       200:
 *         description: List of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   email:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   role:
 *                     type: string
 *       400:
 *         description: Failed to list admins
 *       500:
 *         description: Internal server error
 */

router.get("/admins", authMiddleware, AsyncHandler(AdminController.listAdmins));

export default router;
