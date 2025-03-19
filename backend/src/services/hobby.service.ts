import Hobby from "../models/Hobby.models";
import User from "../models/User.models";
import mongoose from "mongoose";

class HobbyService {
  createHobby = async (data: { name: string; category: string }) => {
    const newHobby = new Hobby(data);
    await newHobby.save();
    return newHobby;
  };

  updateHobby = async (
    hobbyId: string,
    updates: Partial<{ name: string; category: string; users: string[] }>
  ) => {
    const updatedHobby = await Hobby.findByIdAndUpdate(hobbyId, updates);
    if (!updatedHobby) {
      throw new Error("Hobby not found or update failed");
    }
    return updatedHobby;
  };

  deleteHobby = async (hobbyId: string) => {
    const deletedHobby = await Hobby.findByIdAndDelete(hobbyId);
    if (!deletedHobby) {
      throw new Error("Hobby not found or deletion failed");
    }
    return { message: "Hobby deleted successfully" };
  };

  async listHobbies() {
    const hobbies = await Hobby.find();
    return hobbies;
  }

  async getHobbiesByUserId(userId: string) {
    const user = await User.findById(userId).select("hobbies");
    console.log("WE ARE HERE");
    if (!user) {
      throw new Error("User not found");
    } else if (!user.hobbies.length) {
      console.log("No Hobby found");
      return [];
    }
    const hobbies = await Hobby.find({ _id: { $in: user.hobbies } });
    return hobbies;
  }

  /**
   * Add a hobby to a user's profile
   */
  async addHobbyToUser(userId: string, hobbyId: mongoose.Types.ObjectId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
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
      throw new Error("User not found");
    }

    user.hobbies = user.hobbies.filter((id) => id.toString() !== hobbyId);
    await user.save();

    return user;
  }
}

export default new HobbyService();
