import userService from './user.service';
import eventService from './event.service';
import Admin from '../models/Admin.models';

class AdminService {

    async getAdminById(adminId: string) {
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    }
  /**
   * USER MANAGEMENT
   */

  async createUser(data: any) {
    return await userService.createUser(data);
  }

  async updateUser(userId: string, updates: any) {
    return await userService.updateUser(userId, updates);
  }

  async deleteUser(userId: string) {
    return await userService.deleteUser(userId);
  }

  async listUsers(filter: any) {
    return await userService.listUsers(filter);
  }

  /**
   * EVENT MANAGEMENT
   */

  async createEvent(data: any) {
    return await eventService.createEvent(data);
  }

  async updateEvent(eventId: string, updates: any) {
    return await eventService.updateEvent(eventId, updates);
  }

  async deleteEvent(eventId: string) {
    return await eventService.deleteEvent(eventId);
  }

  async listEvents(filter: any) {
    return await eventService.listEvents(filter);
  }
}

export default new AdminService();
