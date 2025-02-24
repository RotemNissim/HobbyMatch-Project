import { Request, Response } from "express";
import adminService from "../services/admin.service";
import User from "../models/User.models";
import bcrypt from "bcrypt";
import Event from "../models/Event.models";

class AdminController {
  async getAdmin(req: Request, res: Response) {
    try {
      const adminId = req.params.id;
      const admin = await adminService.getAdminById(adminId);
      res.status(200).json(admin);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to get admin";
      res.status(404).json({ message: errMsg });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { username, password, email, firstName, lastName } = req.body;
      if (!firstName || !lastName || !username || !email || !password) {
        return res.status(400).json({
          message:
            "All fields are required: firstName, lastName, username, email, password",
        });
      }

      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
      const data = {
        username: username,
        password: password,
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
      const newUser = await adminService.createUser(data);
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to create user";
      res.status(400).json({ message: errMsg });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const updatedAdmin = await adminService.updateUser(userId, updates);
      res.status(200).json(updatedAdmin);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to update admin";
      res.status(400).json({ message: errMsg });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      await adminService.deleteUser(userId);
      res.status(204).json({ message: "User deleted successfully" });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to delete user";
      res.status(400).json({ message: errMsg });
    }
  }
  // לא בטוח אם פילטר יהיה אוביקט מהצורה הנדרשת
  async listUsers(req: Request, res: Response) {
    try {
      const filter = req.query;
      const users = await adminService.listUsers(filter);
      res.status(200).json(users);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to list users";
      res.status(400).json({ message: errMsg });
    }
  }

  async createEvent(req: Request, res: Response) {
    try {
      const { title, description, location, date, hobbies, createdBy } =
        req.body;
      if (
        !title ||
        !description ||
        !location ||
        !date ||
        !hobbies ||
        !createdBy
      ) {
        return res.status(400).json({
          message:
            "All fields are required: title, description, location, date, hobbies, createdBy",
        });
      }
      const existingEvent = await Event.findOne({
        title: title,
        description: description,
        location: location,
        date: date,
        hobbies: hobbies,
      });
      const data = {
        title: title,
        description: description,
        location: location,
        date: date,
        hobbies: hobbies,
        createdBy: createdBy,
        participants: createdBy, // Add the current user as a participant by default. You can modify this to include other users later.
      };
      const newEvent = await adminService.createEvent({ data });
      res.status(201).json({ message: "Event created successfully", newEvent });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to create event";
      res.status(400).json({ message: errMsg });
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      const updates = req.body;
      const updatedEvent = await adminService.updateEvent(eventId, updates);
      res.status(200).json(updatedEvent);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to update event";
      res.status(400).json({ message: errMsg });
    }
  }

  async deleteEvent(req: Request, res: Response) {
    try {
      const eventId = req.params.id;
      await adminService.deleteEvent(eventId);
      res.status(204).json({ message: "Event deleted successfully" });
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to delete event";
      res.status(400).json({ message: errMsg });
    }
  }
  async listEvents(req: Request, res: Response) {
    try {
      const filter = req.query;
      const events = await adminService.listEvents(filter);
      res.status(200).json(events);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Failed to list events";
      res.status(400).json({ message: errMsg });
    }
  }
}
export default new AdminController();
