import userService from './user.service';
import eventService from './event.service';
import Admin from '../models/Admin.models';
import hobbyService from './hobby.service';

class AdminService {

  //Admins

    async getAdminById(adminId: string) {
        const admin = await Admin.findById(adminId).select('-password');
        if (!admin) {
            throw new Error('Admin not found');
        }
        return admin;
    }

   createAdmin = async (data: { email: string, password: string, firstName: string, lastName: string, role: 'admin'}) => {
    const newAdmin = new Admin(data);
    await newAdmin.save();
    return newAdmin;
    }

  updateAdmin = async (adminId: string, updates: Partial<{ email: string, password: string, firstName: string, lastName: string, role: 'admin' }>) => { 
    const admin = await Admin.findByIdAndUpdate(adminId, updates,{ new: true });
    if (!admin) {
        throw new Error('Admin not found or update failed');
    }
    return admin;
  }

  deleteAdmin = async (adminId: string) => {
    const admin = await Admin.findByIdAndDelete(adminId);
    if (!admin) {
        throw new Error('Admin not found');
    }
    return admin;
  }

  listAdmins = async () => {
   const admins = await Admin.find(); 
   return admins;
  }



  //Users

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

//Events

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
