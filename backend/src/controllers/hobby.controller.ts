import { Request, Response } from 'express';
import hobbyService from '../services/hobby.service';

class HobbyController {
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