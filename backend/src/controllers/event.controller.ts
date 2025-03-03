import { Request, Response } from 'express';
import eventService from '../services/event.service';

class EventController {
  /**
   * Create a new event
   */
  async createEvent(req: Request, res: Response) {
    try {
      const eventData = req.body;
      const newEvent = await eventService.createEvent(eventData);
      res.status(201).json(newEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to create event';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Update an existing event
   */
  async updateEvent(req: Request, res: Response) {
    try {
       // Only authenticated users can update events, so include userId in the request params.
      const eventId = req.params.id;
      const updates = req.body;
      const updatedEvent = await eventService.updateEvent(eventId, updates);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to update event';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * Delete an event
   */
  async deleteEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      await eventService.deleteEvent(eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to delete event';
      res.status(400).json({ message: errMsg });
    }
  }

  /**
   * List events with optional filters
   */
  async listEvents(req: Request, res: Response) {
    try {
      const filters = req.query;
      const events = await eventService.listEvents(filters);
      res.status(200).json(events);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to fetch events';
      res.status(400).json({ message: errMsg });
    }
  }
}

export default new EventController();