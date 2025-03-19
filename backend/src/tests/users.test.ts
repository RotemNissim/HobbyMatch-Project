import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, { IUser } from "../models/User.models";

var app: Express;
let session: mongoose.ClientSession;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await userModel.deleteMany();
});

beforeEach(async () => {
  session = await mongoose.startSession();
  session.startTransaction();
});

afterEach(async () => {
  await session.abortTransaction(); 
  session.endSession();
});

afterAll(async () => {
  await mongoose.connection.close(); 
});

const baseUrl = "/auth";
