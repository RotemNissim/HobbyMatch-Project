import { Request, Response } from 'express';
import userService from '../services/user.service';
import eventService from '../services/event.service';
import likeService from '../services/like.service';
import hobbyService from '../services/hobby.service';
import commentService from '../services/comment.service';
import mongoose from 'mongoose';
import userModel, { IUser } from '../models/User.models';
import { AuthUser, AuthRequest }  from '../middleware/AuthRequest';

// ✅ Authenticated request includes full user object (not just _id)

class UserController {

    getCurrentUser = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;  // 💥 Full user object guaranteed

        return res.send({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            hobbies: 'hobbies' in user ? user.hobbies : []
        });
    };

    async getUser(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Failed to get user';
            res.status(404).json({ message: errMsg });
        }
    }

    async updateProfile(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const updates = req.body;
            const updatedUser = await userService.updateUser(userId, updates);
            res.status(200).json(updatedUser);
        } catch (error: unknown) {
            const errMsg = error instanceof Error ? error.message : 'Failed to update user';
            res.status(400).json({ message: errMsg });
        }
    }

    createEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;  // Full user object, guaranteed

        const newEvent = await eventService.createEvent({
            ...req.body,
            createdBy: user._id.toString()
        });

        return res.status(201).send(newEvent);
    };
    deleteUserEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;
        const eventId = req.params.id;
        const deletedEvent = await eventService.deleteEvent(eventId);

        return res.status(200).send(deletedEvent);
    }
    updateEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;
        const eventId = req.params.id;

        const updatedEvent = await eventService.updateEvent(eventId, req.body, user._id.toString());

        return res.status(200).send(updatedEvent);
    };

    getUserHobbies = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;

        const hobbies = await hobbyService.getHobbiesByUserId(user._id.toString());
        return res.status(200).json(hobbies);
    };

    getUserLikes = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;

        const likes = await likeService.getUserLikes(user._id.toString());
        return res.status(200).send(likes);
    };

    addCommentToEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
        const user = req.user;
        const eventId = req.params.id;

        const comment = req.body.content;
        if (!comment) {
            return res.status(400).send("comment is required");
        }

        const newComment = await commentService.addCommentToEvent(
            user._id.toString(),
            eventId,
            comment
        );

        return res.status(201).send(newComment);
    };
}

export default new UserController();
