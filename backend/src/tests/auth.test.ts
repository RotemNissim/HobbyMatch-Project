// __tests__/auth.test.ts

import request from "supertest";
import initApp from "../server"; // Use the initApp function
import mongoose from "mongoose";
import User from "../models/User.models"; // Adjust path as needed
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  app = await initApp(); // Initialize app with MongoDB connection
});

afterEach(async () => {
  await User.deleteMany(); // Clean up users after each test
});

afterAll(async () => {
  await mongoose.connection.close(); // Close DB connection after all tests
});

describe("Authentication Tests", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/register").send({
        firstName: "rotem",
        lastName: "nissim",
        email: "rotem@example.com",
        password: "securepassword123",
      });
      expect(res.statusCode).toEqual(201);
    });

    it("should not register with missing fields", async () => {
      const res = await request(app).post("/auth/register").send({
        email: "rotem@example.com",
      });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("POST /auth/login", () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await request(app).post("/auth/register").send({
        firstName: "rotem",
        lastName: "nissim",
        email: "rotem@example.com",
        password: "securepassword123",
      });
    });

    it("should login with valid credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "rotem@example.com",
        password: "securepassword123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("refreshToken");
    });

    it("should fail login with wrong credentials", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "rotem@example.com",
        password: "wrongpassword",
      });

      expect(res.statusCode).toEqual(400);
    });
  });

  describe("GET /protected", () => {
    let token: string;

    beforeEach(async () => {
      const res = await request(app).post("/auth/register").send({
        firstName: "rotem",
        lastName: "nissim",
        email: "rotem@example.com",
        password: "securepassword123",
      });

      const loginRes = await request(app).post("/auth/login").send({
        email: "rotem@example.com",
        password: "securepassword123",
      });

      token = loginRes.body.accessToken;
    });

    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get("/protected")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
    });

    it("should not access protected route without token", async () => {
      const res = await request(app).get("/protected");

      expect(res.statusCode).toEqual(404);
    });
  });
});