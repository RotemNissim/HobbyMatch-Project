import Hobby from '../models/Hobby.models';
import User from '../models/User.models';
import mongoose from 'mongoose';

class HobbyService {
  /**
   * List all available hobbies
   */
  async listHobbies() {
    const hobbies = await Hobby.find();
    return hobbies;
  }

  async getHobbiesByUserId(userId: mongoose.Types.ObjectId) {
    const user = await User.findById(userId).select('hobbies');
   
    if (!user) {
      throw new Error('User not found');
    } else if  (!user.hobbies.length) {
      throw new Error('Hobbies not found');
    }
    const hobbies = await Hobby.find({_id: {$in: user.hobbies}});
    return hobbies;
  
  }

  /**
   * Add a hobby to a user's profile
   */
  async addHobbyToUser(userId: string, hobbyId: mongoose.Types.ObjectId) {
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
