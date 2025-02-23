import { Request, Response } from 'express';
import adminService from '../services/admin.service';

class AdminController {
  
    async getAdmin(req: Request, res: Response) {
      try {
        const adminId = req.params.id;
        const admin = await adminService.getAdminById(adminId);
        res.status(200).json(admin);} catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Failed to get admin';
        res.status(404).json({ message: errMsg });}}
    
      
       
    async updateProfile(req: Request, res: Response) {
      try {
        const userId = req.params.id;
        const updates = req.body;
        const updatedAdmin = await adminService.updateUser(userId, updates);
        res.status(200).json(updatedAdmin);} catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Failed to update admin';
        res.status(400).json({ message: errMsg });}}
    }
    
    export default new AdminController();
