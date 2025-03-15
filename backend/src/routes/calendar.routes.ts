import express from "express";
import {
  login,
  callback,
  getEvents,
  createEvent,
} from "../controllers/calendar.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Calendar
 *   description: The calendar API
 */

// נתיב להתחברות לאימות של גוגל
router.get("/login", login);

// נתיב לעיבוד התגובה מגוגל לאחר האימות

router.get("/callback", (req, res, next) => {
  callback(req, res, next).catch(next);
});
// {"conversationId":"0df405bc-3b84-4c96-8fab-cdef901849c3","source":"instruct"}

// נתיב לקבלת אירועים מהקלנדר
router.get("/events", getEvents);

// נתיב ליצירת אירוע חדש
router.post("/events", createEvent);

export default router;
