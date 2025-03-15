import { Request, Response } from 'express';
import hobbyService from '../services/hobby.service';
import User from '../models/User.models';
import Hobby from '../models/Hobby.models';
import Event from '../models/Event.models';
import mongoose from 'mongoose';

class HobbyController {

  toggleHobbyInEvent = async (req: Request, res: Response) => {
    try {
        const { eventId } = req.params;
        const { hobbyId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(hobbyId)) {
            return res.status(400).json({ message: "Invalid eventId or hobbyId" });
        }

        const event = await Event.findById(eventId);
        const hobby = await Hobby.findById(hobbyId);

        if (!event || !hobby) {
            return res.status(404).json({ message: "Event or Hobby not found" });
        }

        if (!hobby.users) {
          hobby.users = [];
      }

        // 🔥 Check if the hobby is already in the user's hobbies array
        const hobbyExists = event.hobby.some((id) => id.toString() === hobbyId);
        

        if (hobbyExists) {
            // 🔥 Remove hobby from the User's hobbies array
            event.hobby = event.hobby.filter((id) => id.toString() !== hobbyId);
            await event.save();
            
        } else {
            // 🔥 Add hobby to the User's hobbies array
            event.hobby.push(new mongoose.Types.ObjectId(hobbyId));
            await event.save();
            
        }

      return res.status(200).json({ message: "Hobby updated successfully", hobbies: event.hobby });
    } catch (error) {
        console.error("🔥 Error in toggleHobby:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

   toggleHobby = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const { hobbyId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hobbyId)) {
            return res.status(400).json({ message: "Invalid userId or hobbyId" });
        }

        const user = await User.findById(userId);
        const hobby = await Hobby.findById(hobbyId);

        if (!user || !hobby) {
            return res.status(404).json({ message: "User or Hobby not found" });
        }

        if (!hobby.users) {
          hobby.users = [];
      }

        // 🔥 Check if the hobby is already in the user's hobbies array
        const hobbyExists = user.hobbies.some((id) => id.toString() === hobbyId);
        

        if (hobbyExists) {
            // 🔥 Remove hobby from the User's hobbies array
            user.hobbies = user.hobbies.filter((id) => id.toString() !== hobbyId);
            await user.save();

            // 🔥 Remove the user from the Hobby's users array
            hobby.users = hobby.users.filter((id) => id.toString() !== userId);
            await hobby.save();
        } else {
            // 🔥 Add hobby to the User's hobbies array
            user.hobbies.push(new mongoose.Types.ObjectId(hobbyId));
            await user.save();

            // 🔥 Add user to the Hobby's users array
            hobby.users.push(new mongoose.Types.ObjectId(userId));
            await hobby.save();
        }

        return res.status(200).json({ message: "Hobby updated successfully", hobbies: user.hobbies });
    } catch (error) {
        console.error("🔥 Error in toggleHobby:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
  /**
   * List all hobbies
   */
  async listHobbies(req: Request, res: Response) {
    try {
      const hobbies = await hobbyService.listHobbies();
      res.status(200).json(hobbies);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch hobbies';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Add a hobby to user
   */
  async addHobby(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { hobbyId } = req.body;
      const updatedUser = await hobbyService.addHobbyToUser(userId, hobbyId);
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to add hobby';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Remove a hobby from user
   */
  async removeHobby(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      const { hobbyId } = req.body;
      const updatedUser = await hobbyService.removeHobbyFromUser(userId, hobbyId);
      res.status(200).json(updatedUser);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to remove hobby';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new HobbyController();