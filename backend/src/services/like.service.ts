import User from '../models/User.models';
import Event from '../models/Event.models';
import Like from '../models/Like.models';
import mongoose from 'mongoose';

class LikeService {
  /**
   * Like an event
   */
  async likeEvent(userId:string , eventId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = event.likes.some((id) => id.equals(userObjectId));

    if (!hasLiked) {
      event.likes.push(userObjectId);
      await event.save();
    }

    return event;
  }

  /**
   * Dislike an event
   */
  async dislikeEvent(userId: string, eventId: string) {
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    event.likes = event.likes.filter((id) => id.toString() !== userId);
    await event.save();

    return event;
  }

  /**
   * Like a user
   */
  async likeUser(currentUserId: string, targetUserId: string) {
    const user = await User.findById(targetUserId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.likes.includes(currentUserId)) {
      user.likes.push(currentUserId);
      await user.save();
    }

    return user;
  }

  /**
   * Dislike a user
   */
  async dislikeUser(currentUserId: string, targetUserId: string) {
    const user = await User.findById(targetUserId);
    if (!user) {
      throw new Error('User not found');
    }

    user.likes = user.likes.filter((id) => id.toString() !== currentUserId);
    await user.save();

    return user;
  }

  async getUserLikes(userId: string) {
    // Find all likes where the user has liked events
    const likes = await Like.find({ user: userId }).populate('event');

    if (!likes.length) {
      throw new Error('No liked events found for this user');
    }

    // Extract the full event details from populated likes
    const likedEvents = likes.map((like) => like.event);

    return likedEvents;
  }
}

export default new LikeService();
