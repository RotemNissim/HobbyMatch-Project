import mongoose, { Document, Schema } from 'mongoose';

export interface IHobby extends Document {
  name: string;
  category: string;
}

const HobbySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  category: { type: String, required: true }
});

export default mongoose.model<IHobby>('Hobby', HobbySchema);
