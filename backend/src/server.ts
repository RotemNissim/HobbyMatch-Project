import dotenv from "dotenv";
dotenv.config();  
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import passport from "passport";
import path from 'path';
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

import adminRoute from "./routes/admin.routes";
import userRoute from "./routes/user.routes";
import eventRoute from "./routes/event.routes"; 
import authRoute from "./routes/auth.routes";
import hobbyRoute from "./routes/hobby.routes";
import likeRoute from "./routes/like.routes";
import commentRoute from "./routes/comment.routes";
import "./config/auth.google"; 

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/api/users", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/events", eventRoute);
app.use("/api/auth", authRoute);
app.use("/api/hobbies", hobbyRoute);
app.use("/api/likes", likeRoute);
app.use("/api/comments", commentRoute);
app.use('/api/uploads/profile_pictures', express.static(path.join(__dirname, '../uploads/profile_pictures')));
app.use(express.static("front"));

const options = {
  definition:{
    openapi: "3.0.0",
    info: {
      title: "HobbyMatch API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
  },
  servers: [{ url: "http://localhost:3000/", },],
},
apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connected to the database");
    });
    if (!process.env.MONGO_URI) {
      reject("MONGO_URI is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
