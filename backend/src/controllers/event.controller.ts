import { Request, Response } from 'express';
import eventService from '../services/event.service';
import { AuthUser, AuthRequest }  from '../middleware/AuthRequest';
import mongoose from 'mongoose';
import Event from '../models/Event.models';

class EventController {

  async joinEvent(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const eventId = req.params.id;
      const updatedEvent = await eventService.joinEvent(eventId, userId);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to join event';
      res.status(400).json({ message: errMsg });
    }
  }

  async leaveEvent(req: Request, res: Response) {
    try {
      const userId = (req as any).user._id;
      const eventId = req.params.id;
      const updatedEvent = await eventService.leaveEvent(eventId, userId);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to leave event';
      res.status(400).json({ message: errMsg });
    }
  }
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
        const hobbiesRaw = req.query.hobbies;
        const hobbies = hobbiesRaw
            ? Array.isArray(hobbiesRaw)
                ? hobbiesRaw.map(String)
                : [String(hobbiesRaw)]
            : undefined;

        const participantsRaw = req.query.participants;
        const participants = participantsRaw
            ? Array.isArray(participantsRaw)
                ? participantsRaw.map(String)
                : [String(participantsRaw)]
            : undefined;

        const filters = {
            hobbies,
            location: req.query.location as string,
            date: req.query.date ? new Date(req.query.date as string) : undefined,
            createdBy: req.query.createdBy as string,
            participants
        };

        const events = await eventService.listEvents(filters);
        res.status(200).json(events);
    } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Failed to fetch events';
        res.status(400).json({ message: errMsg });
    }
}

getEvent = async (req: Request, res: Response): Promise<Response> => {
  try {
      const eventId = req.params.id;
      const event = await Event.findById(eventId).populate({
        path: "comments",
        populate: {
            path: "sender", // If you want the comment's author's details
            select: "username email" // Adjust fields as needed
<<<<<<< Updated upstream
        },
    })
    .exec();
=======
        }
    });

      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      return res.json({
          _id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          participants: event.participants.map(p => p._id.toString()),
          createdBy: event.createdBy.toString(),
          hobby: event.hobby.map(h => h._id.toString()),
          image: event.image,
          likes: event.likes.map(l => l._id.toString()),
          comments: event.comments!.map(comment => ({
            _id: comment._id,
            content: comment.content,
            sender: comment.sender// Make sure the comment model includes `text`
          })),
      });
  } catch (error) {
      console.error("❌ Error fetching event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

>>>>>>> Stashed changes

      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      return res.json({
          _id: event._id,
          title: event.title,
          description: event.description,
          date: event.date,
          location: event.location,
          participants: event.participants.map(p => p._id.toString()),
          createdBy: event.createdBy.toString(),
          hobby: event.hobby.map(h => h._id.toString()),
          image: event.image,
          likes: event.likes.map(l => l._id.toString()),
          comments: event.comments?.map(comment=> ({
            _id: comment._id,
            content: (comment as any).content,
            sender: {
              _id: (comment as any).sender._id,
              username: (comment as any).sender.username,
              email: (comment as any).sender.email,
            },
          })) || [],
      });
  } catch (error) {
      console.error("❌ Error fetching event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

getCommentsToEvent = async (req:Request, res:Response):Promise<Response> => {
  try {
      const eventId = req.params.id;
      const comments = await Event.findById(eventId).populate("comments").exec();
      if (!comments) {
          return res.status(404).json({ message: "Event not found" });
      }
      return res.json(comments.comments);
  } catch (error) {
      console.error("Error fetching comments to event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
}

}

export default new EventController();