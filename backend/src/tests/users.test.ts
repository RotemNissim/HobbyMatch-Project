import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import userModel, {IUser} from "../models/User.models";

var app:Express;

beforeAll(async () => {
    console.log("beforeAll");
    app = await initApp();
    await userModel.deleteMany();
});

afterAll((done) => {
    console.log("afterAll");
    mongoose.connection.close();
    done();
});

const baseUrl = "/auth";
