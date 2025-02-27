import Comment from "../models/Comment.models";
import mongoose from "mongoose";

class MessageService {
  /**
   * Send a comment from one user to another
   */
  async sendMessage(senderId: string, receiverId: string, content: string) {
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
  async getMessages(userId1: string, userId2: string) {
    const comments = await Comment.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    return comments;
  }
}

export default new MessageService();
