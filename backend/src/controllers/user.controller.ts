import { Request, Response } from 'express';
import userService from '../services/user.service';

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
}

export default new UserController();