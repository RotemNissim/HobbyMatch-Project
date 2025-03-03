import Event from '../models/Event.models';
import mongoose from 'mongoose';

class EventService {
  /**
   * Create a new event
   */
  async createEvent(data: { title: string; description: string; date: Date; location: string; hobbies: string[]; createdBy: string; }) {
    const newEvent = new Event(data);
    await newEvent.save();
    return newEvent;
  }

  /**
   * Update an existing event
   */
  async updateEvent( eventId: string, updates: Partial<{ title: string; description: string; date: Date; location: string; hobbies: string[] }>, userId?: string) {
    const event = await Event.findByIdAndUpdate(eventId, updates, { new: true });
    if (!event) {
      throw new Error('Event not found or update failed');
    }
    return event;
  }

  /**
   * Delete an event
   */
  async deleteEvent(eventId: string) {
    const event = await Event.findByIdAndDelete(eventId);
    if (!event) {
      throw new Error('Event not found or delete failed');
    }
    return { message: 'Event deleted successfully' };
  }

  /**
   * List events with optional filtering
   */
  async listEvents(filter: Partial<{
    hobbies: string[];
    location: string;
    date: Date;
    createdBy: string;
    participants: string[];
}>) {
    const query: any = {};

    if (filter.hobbies) {
        query.hobby = { $in: filter.hobbies.map(id => new mongoose.Types.ObjectId(id)) };
    }

    if (filter.location) {
        query.location = filter.location;
    }

    if (filter.date) {
        query.date = { $gte: filter.date };
    }

    if (filter.createdBy) {
        query.createdBy = new mongoose.Types.ObjectId(filter.createdBy);
    }

    if (filter.participants) {
        query.participants = { $in: filter.participants.map(id => new mongoose.Types.ObjectId(id)) };
    }

    const events = await Event.find(query).populate('hobby participants createdBy');
    return events;
}

}



export default new EventService();
