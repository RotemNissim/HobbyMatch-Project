// __tests__/auth.test.ts

import request from "supertest";
import initApp from "../server"; // Use the initApp function
import mongoose from "mongoose";
import User from "../models/User.models"; // Adjust path as needed
import { Express } from "express";

let app: Express;
let session: mongoose.ClientSession;

beforeAll(async () => {
  app = await initApp(); // Initialize app with MongoDB connection
});

afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection
});

describe("Authentication Tests", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/register").send({
        firstName: "new",
        lastName: "user2",
        email: "newUser2@example.com",
        password: "newUser",
      });
      expect(res.statusCode).toEqual(201);
    });
    
    it("should not register with missing fields", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "rotem@example.com",
      });

      expect(res.statusCode).toEqual(400);
    });

    describe("POST /auth/login", () => {
      beforeAll(async () => {
        const res = await request(app).post("/auth/register").send({
          firstName: "new",
          lastName: "user",
          email: "newUser@example.com",
          password: "newUser",
        });
      });

      it("should login with valid credentials", async () => {
        const res = await request(app).post("/auth/login").send({
          email: "newUser@example.com",
          password: "newUser",
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("refreshToken");
      });

      it("should fail login with wrong credentials", async () => {
        const res = await request(app).post("/auth/login").send({
          email: "newUser@example.com",
          password: "wrongpassword",
        });

        expect(res.statusCode).toEqual(400);
      });
    });
  });
});
