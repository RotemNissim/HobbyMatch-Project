import dotenv from "dotenv"
dotenv.config();
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express, { Express } from 'express';
import adminRoute from './routes/admin.routes';
import userRoute from './routes/user.routes';
import eventRoute from './routes/event.routes';
import authRoute from './routes/auth.routes';
import adminAuthRoute from './routes/adminAuth.routes';
import hobbyRoute from './routes/hobby.routes';
import likeRoute from './routes/like.routes';
import commentRoute from './routes/comment.routes';
import notificationRoute from './routes/notification.routes';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use("/users", userRoute);
app.use("/admins", adminRoute);
app.use("/events", eventRoute);
app.use("/auth", authRoute);
app.use("/adminAuth", adminAuthRoute);
app.use("/hobbies", hobbyRoute);
app.use("/likes", likeRoute);
app.use("/comments", commentRoute);
app.use("/notifications", notificationRoute);
app.use("/public", express.static("public"));
app.use(express.static("front"));

const db = mongoose.connection;
db.once("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

  const initApp = () => {
    return new Promise<Express>((resolve, reject) => {
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