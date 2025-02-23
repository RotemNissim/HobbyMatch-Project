import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hobbies: string[];
  calendar: any[];
  profilePicture: string;
  likes: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true},
  password: { type: String, required: true },
  hobbies: [{ type: String }],
  calendar: [{ type: Object }],
  profilePicture: { type: String, default: '' },
  likes: [{ type: String }],
});

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model<IUser>('User', UserSchema);

export default userModel;
