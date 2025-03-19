import User, {IUser} from '../models/User.models';
import bcrypt from 'bcrypt';
import Hobby from '../models/Hobby.models';

class UserService {

  async getHobbiesByUserId(userId: string) {
    const user = await User.findById(userId).select('hobbies');
   
    if (!user) {
      throw new Error('User not found');
    } else if  (!user.hobbies.length) {
      throw new Error('Hobbies not found');
    }
    const hobbies = await Hobby.find({_id: {$in:user.hobbies}});
    return hobbies;
  
  }

  async createUser(data: { username: string; password: string, email: string, firstName: string, lastName: string}) {
    const hashedPassword = await bcrypt.hash(data.password, 10); 
    const newUser = new User({
      ...data,
      password:hashedPassword
    });
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

  async updateUser(userId: string, updates: Partial<{ firstName: string, lastName: string, email: string, password?: string, profilePicture?: string, hobbies: string[] }>) {
      if (updates.password) {
        console.log('password is updated');
          updates.password = await bcrypt.hash(updates.password, 10);
      }
      
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

  async listUsers(filter: Partial<{firstName: string; email:string, lastName: string}>) {
    const query: any = {};
    if (filter.firstName) {
      query.firstName = { $regex: filter.firstName,$options: 'i' };
    }
    if (filter.email) {
      query.email = { $regex: filter.email,$options: 'i' };
     }
    if (filter.lastName) {
      query.lastName = { $regex: filter.lastName,$options: 'i' };
 
    }
     const users = await User.find(query).select('-password');
     return users;
    }

   
  
}


export default new UserService();
