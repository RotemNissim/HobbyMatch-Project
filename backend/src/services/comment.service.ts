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

  /**
   * Get all comments between two users
   */
  async getComments(userId1: string, userId2: string) {
    const comments = await Comment.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    return comments;
  }
 async addCommentToEvent(userId:string, eventId: string, comment:string) {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  // Create a new comment
  const newComment = new Comment({ sender: userId, event: eventId, content: comment });
  await newComment.save();

  // Add the comment reference to the event
  const commentId = newComment._id as mongoose.Types.ObjectId;
  event.comments?.push(commentId);
  await event.save();

  return newComment;
}
 }


export default new CommentService();
