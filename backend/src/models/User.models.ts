import mongoose from 'mongoose';
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  _id?:string;
  refreshToken?:string[];
  password: string;
  hobbies: mongoose.Types.ObjectId[];
  calendar: any[];
  profilePicture: string;
  likes: string[];
  googleId?: string;
}

const UserSchema = new mongoose.Schema<IUser>({  
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  refreshToken: {type: [String], default:[]},
  password: { type: String, required: true },
  hobbies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby' }],
  calendar: [{ type: Object }],
  profilePicture: { type: String, default: '' },
  likes: [{ type: String }],
});


const userModel = mongoose.model<IUser>('User', UserSchema);

export default userModel;
