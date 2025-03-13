import { Request, Response } from "express";
import { AuthRequest } from "../middleware/AuthRequest";
import User from "../models/User.models";
import Event from "../models/Event.models";
import Hobby from "../models/Hobby.models";
import Admin from "../models/Admin.models";
import adminService from "../services/admin.service";
import hobbyService from "../services/hobby.service";
import userService from "../services/user.service";
import eventService from "../services/event.service";

class AdminController {

   //Admin Management

    getCurrentAdmin = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const admin = req.admin;
      return res.status(200).send({
        id: admin._id,
        email: admin.email,
        role: 'admin',
      });
     } catch (err) {
     return res.status(400).send("Failed to get current admin");
    }
   }

   createAdmin = async (req: AuthRequest, res: Response): Promise<Response> => { 
    try {

      const newAdmin = await adminService.createAdmin({
        ...req.body
      })

      return res.status(201).send(newAdmin);

    } catch (err) {
      return res.status(400).send("Failed to create new admin");
    }
   } 

   updateAdmin = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const adminId = req.params.id;
      const updates = req.body;
      const updatedAdmin = await adminService.updateAdmin(adminId, updates);
      return res.status(200).send(updatedAdmin);

    } catch (err) {
      return res.status(400).send("Failed to update admin");

    }
   }

   deleteAdmin = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const adminId = req.params.id;
      await adminService.deleteAdmin(adminId);
      return res.status(200).send("Admin deleted successfully");
    } catch (err) {
      return res.status(400).send("Failed to delete admin");
    }
  }

  listAdmins = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const admins = await adminService.listAdmins();
      return res.status(200).send(admins);
    } catch (err) {
      return res.status(400).send("Failed to list admins");
    }
  }

   //Users Management

   createUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const newUser = await userService.createUser({
        ...req.body
      })
      return res.status(201).send(newUser);
    } catch (err) {
      return res.status(400).send("Failed to create new user");
    }
   }

   updateUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const updates = req.body;
      const updatedUser = await userService.updateUser(userId, updates);
      return res.status(200).send(updatedUser);
    } catch (err) {
      return res.status(400).send("Failed to update user");
    }
  }

  deleteUser = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
       const userId = req.params.id;
      await userService.deleteUser(userId);
      return res.status(200).send("User deleted successfully");
    } catch (err) { 
      return res.status(400).send("Failed to delete user");
    }
  }

  listUsers = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const users = await userService.listUsers({
        firstName: req.query.firstName as string,
        email: req.query.email as string,
        lastName: req.query.lastName as string,
      });
      return res.status(200).send(users);
    } catch (err) {
      return res.status(400).send("Failed to list users");
    }
  }


   //Events Management
   createEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const newEvent = await eventService.createEvent({
       ...req.body,
        createdBy: req.user._id.toString()
      })
      return res.status(201).send(newEvent);
    } catch (err) { 
      return res.status(400).send("Failed to create new event");
    }
  }

  updateEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const user = req.user;
      const eventId = req.params.id;
      const updates = req.body;
      const updatedEvent = await eventService.updateEvent(eventId, updates,user._id.toString());
      return res.status(200).send(updatedEvent);
    } catch (err) {
      return res.status(400).send("Failed to update event");
    }
  }

  deleteEvent = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const eventId = req.params.id;
      await eventService.deleteEvent(eventId);
      return res.status(204).json({ message: "Event deleted successfully" });
    } catch (err) {
      return res.status(400).send("Failed to delete event");
    }
  }

  listEvents = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const events = await eventService.listEvents({
        hobbies: req.query.hobbies as string[],
        location: req.query.location as string,
        date: new Date,
        createdBy: req.query.createdBy as string,
        participants: req.query.participants as string[],
      });
      return res.status(200).send(events);
    } catch (err) { 
      return res.status(400).send("Failed to list events");
    }
  }

   //Hobbies Management

   createHobby = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const newHobby = await hobbyService.createHobby({
        ...req.body
      })
      return res.status(201).send(newHobby);
    } catch (err) { 
      return res.status(400).send("Failed to create new hobby");
    }
  }

  updateHobby = async (req: AuthRequest, res: Response): Promise<Response> => {
    try { 
      const hobbyId = req.params.id;
      const updates = req.body;
      const updatedHobby = await hobbyService.updateHobby(hobbyId, updates);
      return res.status(200).send(updatedHobby);
    } catch (err) {
      return res.status(400).send("Failed to update hobby");
    }
  }

  deleteHobby = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const hobbyId = req.params.id;
      await hobbyService.deleteHobby(hobbyId);
      return res.status(204).json({ message: "Hobby deleted successfully" });
    } catch (err) { 
      return res.status(400).send("Failed to delete hobby");
    }
  }

  listHobbies = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
      const hobbies = await hobbyService.listHobbies();
      return res.status(200).send(hobbies);
    } catch (err) { 
      return res.status(400).send("Failed to list hobbies");
    }
  }

}
export default new AdminController();
