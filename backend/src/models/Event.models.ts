import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  location: string;
  participants: mongoose.Types.ObjectId[]; // הפניות ל-User
  createdBy: mongoose.Types.ObjectId;
  hobby: string;
  image?: string;
}

const EventSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  hobby: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model<IEvent>('Event', EventSchema);
