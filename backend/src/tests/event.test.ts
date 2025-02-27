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

beforeAll(async () => {
  app = await initApp();

  // יצירת משתמש לבדיקה
  const userRes = await request(app).post("/auth/register").send({
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    password: "testpassword123",
  });
  
  userToken = userRes.body.refreshToken;
  userId = userRes.body._id;
});

afterEach(async () => {
  await Event.deleteMany(); // ניקוי האירועים אחרי כל בדיקה
});

afterAll(async () => {
  await mongoose.connection.close(); // סגירת חיבור למסד הנתונים
});

describe("Event API Tests", () => {
  describe("POST /events", () => {
    it("should create a new event", async () => {
      const res = await request(app)
        .post("/events")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "Test Event",
          description: "This is a test event",
          date: new Date(),
          location: "Tel Aviv",
          hobby: "Music",
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
        hobby: "Art",
        createdBy: userId,
      });

      const res = await request(app).get("/events");
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
        hobby: "Sports",
        createdBy: userId,
      });

      const res = await request(app)
        .put(`/events/${event._id}`)
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
        hobby: "Diving",
        createdBy: userId,
      });

      const res = await request(app)
        .delete(`/events/${event._id}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toEqual("Event deleted successfully");
    });
  });
});
