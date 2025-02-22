import User from '../models/User.models';

class UserService {
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
}

export default new UserService();
