// __tests__/auth.test.ts

import request from "supertest";
import initApp from "../server"; // Use the initApp function
import mongoose from "mongoose";
import User from "../models/User.models"; // Adjust path as needed
import { Express } from "express";

let app: Express;
let userId: string;

beforeAll(async () => {
  app = await initApp(); // Initialize app with MongoDB connection
});

afterAll(async () => {
  if (userId) {
    const res = await request(app).post("/api/auth/login").send({
      email: "galtest@test.com",
      password: "1234",
    });
    let userToken: string = res.body.accessToken;
   
    await request(app)
    .delete(`/api/admin/users/${userId}`)
    .set("Authorization", `Bearer ${userToken}`)
    .send();
  }

  await mongoose.connection.close(); // Close DB connection
});

describe("Authentication Tests", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/api/auth/register").send({
        firstName: "new",
        lastName: "user2",
        email: "newUser2@example.com",
        password: "newUser",
      });
      userId = res.body.user._id;

      expect(res.statusCode).toEqual(201);
    });

    it("should not register with missing fields", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "rotem@example.com",
      });

      expect(res.statusCode).toEqual(400);
    });

    describe("POST /auth/login", () => {
      it("should login with valid credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({
          email: "newUser2@example.com",
          password: "newUser",
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("refreshToken");
      });

      it("should fail login with wrong credentials", async () => {
        const res = await request(app).post("/api/auth/login").send({
          email: "newUser2@example.com",
          password: "wrongpassword",
        });

        expect(res.statusCode).toEqual(400);
      });
    });
  });
});
