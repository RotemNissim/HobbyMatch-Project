import Event from '../models/Event.models';

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
  async updateEvent(eventId: string, updates: Partial<{ title: string; description: string; date: Date; location: string; hobbies: string[] }>) {
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
  async listEvents(filter: Partial<{ hobbies: string[]; location: string; date: Date }>) {
    const query: any = {};

    if (filter.hobbies) {
      query.hobbies = { $in: filter.hobbies };
    }

    if (filter.location) {
      query.location = filter.location;
    }

    if (filter.date) {
      query.date = { $gte: filter.date };
    }

    const events = await Event.find(query);
    return events;
  }
}

export default new EventService();
