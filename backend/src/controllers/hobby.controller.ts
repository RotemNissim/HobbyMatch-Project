import { Request, Response } from 'express';
import hobbyService from '../services/hobby.service';
import User from '../models/User.models';
import Hobby from '../models/Hobby.models';
import mongoose from 'mongoose';

class HobbyController {

    toggleHobby = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { hobbyId } = req.body;

      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(hobbyId)) {
          return res.status(400).json({ message: "Invalid userId or hobbyId" });
      }

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // 🔥 Check if the hobby is already in the user's hobbies array
      const hobbyExists = user.hobbies.some((id) => id.toString() === hobbyId);

      if (hobbyExists) {
          // 🔥 Remove hobby if it exists
          user.hobbies = user.hobbies.filter((id) => id.toString() !== hobbyId);
      } else {
          // 🔥 Add hobby if it doesn't exist
          user.hobbies.push(new mongoose.Types.ObjectId(hobbyId.toString()));
      }

      await user.save();

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