import Comment from "../models/Comment.models";
import mongoose from "mongoose";
import Event from "../models/Event.models";
import User from "../models/User.models";

class CommentService {
  /**
   * Send a comment from one user to another
   */
  async sendComment(senderId: string, receiverId: string, content: string) {
    const newComment = new Comment({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(receiverId),
      content,
      timestamp: new Date(),
    });

    await newComment.save();
    return newComment;
  }
 async addCommentToEvent(userId:string, eventId: string, comment:string) {
  console.log("🔍 Checking Event in DB:", eventId);

  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Create a new comment
  const newComment = new Comment({ sender: userId, event: eventId, content: comment });
  console.log("📝 New Comment Data:", { sender: userId, event: eventId, content: comment });
  await newComment.save();

  // Add the comment reference to the event
  const commentId = newComment._id as mongoose.Types.ObjectId;
  event.comments?.push(commentId);
  console.log("📝 New Comment Data:", { sender: userId, event: eventId, content: comment });
  await event.save();

  const populatedComment = await newComment.populate('sender', 'email');

  return populatedComment;
}
 }


export default new CommentService();
