import mongoose, { Document, Schema } from 'mongoose';

export interface IHobby extends Document {
  name: string;
  category: string;
  users: mongoose.Types.ObjectId[];
}

const HobbySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model<IHobby>('Hobby', HobbySchema);
