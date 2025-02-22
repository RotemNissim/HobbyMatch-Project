import Hobby from '../models/Hobby.models';
import User from '../models/User.models';

class HobbyService {
  /**
   * List all available hobbies
   */
  async listHobbies() {
    const hobbies = await Hobby.find();
    return hobbies;
  }

  /**
   * Add a hobby to a user's profile
   */
  async addHobbyToUser(userId: string, hobbyId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.hobbies.includes(hobbyId)) {
      user.hobbies.push(hobbyId);
      await user.save();
    }

    return user;
  }

  /**
   * Remove a hobby from a user's profile
   */
  async removeHobbyFromUser(userId: string, hobbyId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.hobbies = user.hobbies.filter((id) => id.toString() !== hobbyId);
    await user.save();

    return user;
  }
}

export default new HobbyService();
