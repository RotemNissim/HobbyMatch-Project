import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  sender: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

const CommentSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
