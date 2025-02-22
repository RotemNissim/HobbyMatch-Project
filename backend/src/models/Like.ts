import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
}

const LikeSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true }
}, { timestamps: true });

export default mongoose.model<ILike>('Like', LikeSchema);
