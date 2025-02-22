import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  hobbies: string[];
  calendar: any[];
  profilePicture: string;
  likes: string[];
}
const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  hobbies: [{ type: String }],
  calendar: [{ type: Object }],
  profilePicture: { type: String, default: '' },
  likes: [{ type: String }],
});


const userModel = mongoose.model<IUser>('User', UserSchema);

export default userModel;
