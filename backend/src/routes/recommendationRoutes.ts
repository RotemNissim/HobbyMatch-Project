import express from "express";
import { getEventRecommendation } from "../controllers/recommendationController";

const router = express.Router();

// מסלול לקבלת המלצה לפי מזהה המשתמש
router.get("/:id", getEventRecommendation);

export default router;
