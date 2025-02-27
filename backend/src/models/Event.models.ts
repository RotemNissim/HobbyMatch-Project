import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  participants: mongoose.Types.ObjectId[]; // הפניות ל-User
  createdBy: mongoose.Types.ObjectId;
  hobby: mongoose.Types.ObjectId[];
  image?: string;
  likes: mongoose.Types.ObjectId[]; 
  comments?: mongoose.Types.ObjectId[];
}

const eventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  hobby: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hobby', required: true }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
}, { timestamps: true });

const eventModel = mongoose.model<IEvent>('Event', eventSchema);
export default eventModel;
