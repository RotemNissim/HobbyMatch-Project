import dotenv from "dotenv";
dotenv.config();  // טוען משתני סביבה מ-.env

import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import passport from "passport";

import adminRoute from "./routes/admin.routes";
import userRoute from "./routes/user.routes";
import eventRoute from "./routes/event.routes";  // כבר קיים, לוודא שהוא נטען נכון
import authRoute from "./routes/auth.routes";
import hobbyRoute from "./routes/hobby.routes";
import likeRoute from "./routes/like.routes";
import commentRoute from "./routes/comment.routes";

import "./config/auth.google"; // קובץ אימות OAuth של גוגל

const app = express();

app.use(passport.initialize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// הגדרות CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// הוספת הנתיבים לאפליקציה
app.use("/users", userRoute);
app.use("/admins", adminRoute);
app.use("/events", eventRoute); // זה כבר כולל את ה-API של ההמלצות
app.use("/auth", authRoute);
app.use("/hobbies", hobbyRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);
app.use("/public", express.static("public"));
app.use(express.static("front"));

// חיבור למסד הנתונים
const db = mongoose.connection;
db.once("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

// אתחול האפליקציה
const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.MONGO_URI) {
      reject("MONGO_URI is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
          console.log("✅ MongoDB Connected Successfully");
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;
