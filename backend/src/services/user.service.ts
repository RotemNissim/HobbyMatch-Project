import User from '../models/User.models';

class UserService {

  async createUser(data: { username: string; password: string, email: string, firstName: string, lastName: string}) {
    const newUser = new User(data);
    await newUser.save();
    return newUser;
  }
  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  async updateUser(userId: string, updates: Partial<{ username: string; email: string; hobbies: string[] }>) {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    if (!user) {
      throw new Error('User not found or update failed');
    }
    return user;
  }

  async deleteUser(userId:string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found or deletion failed');
    }
    return { message: 'User Deleted successfully'};
  }

  async listUsers(filter: Partial<{username: string; email:string}>) {
    const query: any = {};
    if (filter.username) {
      query.username = { $regex: filter.username,$options: 'i' };
    }
    if (filter.email) {
      query.email = { $regex: filter.email,$options: 'i' };
     }

     const users = await User.find(query).select('-password');
     return users;
    }
  
}


export default new UserService();
