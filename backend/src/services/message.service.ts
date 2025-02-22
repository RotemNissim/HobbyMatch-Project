import Message from '../models/Message.models';
import mongoose from 'mongoose';

class MessageService {
  /**
   * Send a message from one user to another
   */
  async sendMessage(senderId: string, receiverId: string, content: string) {
    const newMessage = new Message({
      sender: new mongoose.Types.ObjectId(senderId),
      receiver: new mongoose.Types.ObjectId(receiverId),
      content,
      timestamp: new Date(),
    });

    await newMessage.save();
    return newMessage;
  }

  /**
   * Get all messages between two users
   */
  async getMessages(userId1: string, userId2: string) {
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    return messages;
  }
}

export default new MessageService();
