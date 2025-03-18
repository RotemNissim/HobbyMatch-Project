import dotenv from "dotenv";
dotenv.config();  
import { Request, Response } from 'express';
import eventService from '../services/event.service';
import { AuthRequest } from '../middleware/AuthRequest';
import Event from '../models/Event.models';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import User from '../models/User.models';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing! Set it in your .env file.");
}

// ✅ Ensure you're using the latest API version
const gemini = new GoogleGenerativeAI(apiKey);

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

  async updateEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      const updates = req.body;
      const updatedEvent = await eventService.updateEvent(eventId, updates);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : 'Failed to update event';
      res.status(400).json({ message: errMsg });
    }
  }

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
        name: req.query.name as string,
        hobbies: Array.isArray(req.query.hobbies) ? req.query.hobbies.map(String) : req.query.hobbies ? [String(req.query.hobbies)] : undefined,
        location: req.query.location as string,
        date: req.query.date ? new Date(req.query.date as string) : undefined,
        createdBy: req.query.createdBy as string,
        participants,
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
      const event = await Event.findById(eventId)
        .populate('createdBy', '_id firstName lastName email')
        .populate({
          path: 'comments',
          populate: {
            path: 'sender',
            select: 'email',
          },
        })
        .exec();

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      return res.json({
        _id: event._id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        participants: event.participants.map((p) => p._id.toString()),
        createdBy: event.createdBy.toString(),
        hobby: event.hobby.map((h) => h._id.toString()),
        image: event.image,
        likes: event.likes.map((l) => l._id.toString()),
        comments:
          event.comments?.map((comment) => ({
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
      console.error('❌ Error fetching event:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  getCommentsToEvent = async (req: Request, res: Response): Promise<Response> => {
    try {
      const eventId = req.params.id;
      const comments = await Event.findById(eventId)
        .populate({
          path: 'comments',
          populate: {
            path: 'sender',
            select: 'email',
          },
        })
        .exec();
      if (!comments) {
        return res.status(404).json({ message: 'Event not found' });
      }
      return res.json(comments.comments);
    } catch (error) {
      console.error('Error fetching comments to event:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };

  recommendEvents = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User ID missing.' });
        return;
      }
  
      const user = await User.findById(userId).populate('hobbies');
      if (!user || !user.hobbies || user.hobbies.length === 0) {
        res.status(404).json({ message: 'No hobbies found for the user.' });
        return;
      }
  
      const hobbies = user.hobbies.map((hobby: any) => hobby.name);
      const { startDate, endDate } = req.body;
      if (!startDate || !endDate) {
        res.status(400).json({ message: 'A date range must be provided.' });
        return;
      }
  
      // Gemini API request
      const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Suggest 3 creative event ideas for someone who enjoys ${hobbies.join(', ')}. 
      They are available between ${startDate} and ${endDate}. 
      Each event should have a unique, **fun name** and a **short description (2 sentences max)**. keep descriptions concise and engaging, avoiding unnecessary details.`;
  
      const response = await model.generateContent(prompt);
      const text = response.response.text();
  
      // Format response
      const formattedSuggestions = text.split('\n').map((s) => s.trim()).filter(Boolean);
  
      res.json({ recommendations: formattedSuggestions });
    } catch (error:unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Error generating event recommendations.';
      console.error('Error recommending events:',errorMsg);
      res.status(500).json({ message: 'Error generating event recommendations.' });
    }
  }
}
export default new EventController();
