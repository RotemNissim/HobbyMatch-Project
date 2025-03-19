// __tests__/event.test.ts

import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import Event from "../models/Event.models";
import User from "../models/User.models";
import { Express } from "express";

let app: Express;
let userToken: string;
let userId: string;
let session: mongoose.ClientSession;

beforeAll(async () => {
  app = await initApp();

  // יצירת משתמש לבדיקה
  await request(app).post("/api/auth/register").send({
    firstName: "Events",
    lastName: "User",
    email: "eventuser@example.com",
    password: "eventUser",
  });

  const res = await request(app).post("/api/auth/login").send({
    email: "eventuser@example.com",
    password: "eventUser",
  });

  userToken = res.body.accessToken;
  userId = res.body._id;
});

afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection
});

describe("Event API Tests", () => {
  describe("POST /events", () => {
    it("should create a new event", async () => {
      const res = await request(app)
        .post("/api/events")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Test Event",
          description: "This is a test event",
          date: new Date(),
          location: "Tel Aviv",
          hobbies: ["67dae9f5a8d3d895500c4d65"],
          createdBy: userId,
        });

      expect(res.statusCode).toEqual(201);
    });
  });

  describe("GET /events", () => {
    it("should return a list of events", async () => {
      await Event.create({
        title: "Sample Event",
        description: "Description here",
        date: new Date(),
        location: "Jerusalem",
        hobby: ["67dae9f5a8d3d895500c4d65"],
        createdBy: userId,
      });

      const res = await request(app).get("/api/events");

      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("PUT /events/:id", () => {
    it("should update an existing event", async () => {
      const event = await Event.create({
        title: "Old Title",
        description: "Old description",
        date: new Date(),
        location: "Haifa",
        hobbies: ["67dae9f5a8d3d895500c4d65"],
        createdBy: userId,
      });

      const res = await request(app)
        .put(`/api/events/${event._id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ title: "Updated Title" });

      expect(res.statusCode).toEqual(200);
      expect(res.body.title).toEqual("Updated Title");
    });
  });

  describe("DELETE /events/:id", () => {
    it("should delete an event", async () => {
      const event = await Event.create({
        title: "To Be Deleted",
        description: "This will be deleted",
        date: new Date(),
        location: "Eilat",
        hobbies: ["67dae9f5a8d3d895500c4d65"],
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/api/events/${event._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Event deleted successfully");
    });
  });
});
