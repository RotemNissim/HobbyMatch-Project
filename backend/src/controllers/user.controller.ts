import { Request, Response } from 'express';
import userService from '../services/user.service';
import eventService from '../services/event.service';
import likeService from '../services/like.service';
import hobbyService from '../services/hobby.service';
import commentService from '../services/comment.service';


export interface AuthRequest extends Request {
  user?: { id: string};
}
class UserController {
  
async getUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const user = await userService.getUserById(userId);
    res.status(200).json(user);} catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to get user';
    res.status(404).json({ message: errMsg });}}

  
   
async updateProfile(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updatedUser = await userService.updateUser(userId, updates);
    res.status(200).json(updatedUser);} catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Failed to update user';
    res.status(400).json({ message: errMsg });}}

    createEvent = async (req:AuthRequest, res:Response): Promise<Response> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          return res.status(401).send("user not found");
        }
        const newEvent = await eventService.createEvent({...req.body,createdBy:userId});
        return res.status(201).send(newEvent);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "failed to create event";
        return res.status(500).send(errorMsg);
      }
    };

       updateEvent = async (req: AuthRequest, res: Response) : Promise<Response> => {
          try {
            const userId = req.user?.id;
            if (!userId) {
              return res.status(401).send("user not found");
            }
            const eventId = req.params.id;
            const updates = req.body;
            const updatedEvent = await eventService.updateEvent(userId,eventId, updates);
            return res.status(200).send(updatedEvent);
          } catch (err) {
            const errMsg = err instanceof Error ? err.message : "Failed to update event";
              return res.status(400).send(errMsg);
          }
      }

      getUserHobbies = async (req:AuthRequest, res:Response) : Promise<Response> => {
        try {
          const userId = (req.user?.id) as string;
          const hobbies = await hobbyService.getHobbiesByUserId(userId);
          return res.status(200).send(hobbies);
        } catch (err) {
           return res.status(404).send(err);
        }
        
      }
      
      getUserLikes = async (req:AuthRequest, res: Response) : Promise<Response> => {
        try {
          const userId = (req.user?.id) as string;
          const likes = await likeService.getUserLikes(userId);
          return res.status(200).send(likes);
        } catch (err) {
          return res.status(404).send(err);
        }
      }

      addCommentToEvent = async (req:AuthRequest, res:Response) : Promise<Response> => {
        try {
          const userId = (req.user?.id) as string;
          const eventId = req.params.id;
          const comment = req.body;
          const newComment = await commentService.addCommentToEvent(userId, eventId, comment);
          return res.status(201).send(newComment);
        } catch (err) {
          return res.status(400).send(err);
        }
      }
    }



export default new UserController();